import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as net from 'net';
import { CentroOperacionesService } from '../centro-operaciones.service';
import { PrismaAdminService } from '../../../prisma/prisma-admin.service';
import { TenantContextService } from '../../../common/context/tenant-context.service';

@Injectable()
export class SiaReceiverService implements OnModuleInit, OnModuleDestroy {
  private server: net.Server;
  private readonly logger = new Logger(SiaReceiverService.name);
  private readonly PORT = 9100;

  // El receptor TCP no tiene contexto de tenant: resuelve el dispositivo→tenant
  // con el cliente admin (cross-tenant) y luego procesa el evento DENTRO del
  // contexto del tenant resuelto, para que las escrituras respeten RLS.
  constructor(
    private readonly coService: CentroOperacionesService,
    private readonly prisma: PrismaAdminService,
    private readonly tenantContext: TenantContextService,
  ) {}

  onModuleInit() {
    this.startServer();
  }

  onModuleDestroy() {
    if (this.server) {
      this.server.close();
    }
  }

  private startServer() {
    this.server = net.createServer((socket) => {
      this.logger.log(`New connection from ${socket.remoteAddress}`);

      socket.on('data', async (data) => {
        const raw = data.toString();
        this.logger.log(`Received raw data: ${raw}`);

        try {
          const event = await this.parseDC09(raw);
          if (event) {
            // ACK the panel (SIA DC-09 standard ACK)
            // Format: <ACK>sequence
            const sequence = raw.match(/\"(\d+)\"/)?.[1] || '0000';
            socket.write(`\n<ACK>${sequence}\r`);

            // Procesa el evento bajo el contexto del tenant resuelto (RLS).
            await this.tenantContext.run(event.tenant_id, () =>
              this.coService.processEvent(event),
            );
          }
        } catch (err) {
          this.logger.error(`Error parsing DC-09: ${err.message}`);
          // NAK if failed (optional, some panels prefer silence on error)
        }
      });

      socket.on('error', (err) => {
        this.logger.error(`Socket error: ${err.message}`);
      });
    });

    this.server.listen(this.PORT, '0.0.0.0', () => {
      this.logger.log(`SIA DC-09 Receiver listening on port ${this.PORT}`);
    });
  }

  /**
   * Simplified SIA DC-09 Parser
   * Example: "01010040\"SIA-DCS\"0001L0#601000[#601000|1130 01 001]_14:15:00,06-23-2026"
   * Real standard is more complex with framing, but many IP communicators send ASCII SIA.
   */
  private async parseDC09(raw: string) {
    // 1. Extract Account (nro_abonado)
    // Looking for #ACCOUNT
    const accountMatch = raw.match(/#([A-Fa-f0-9]+)/);
    if (!accountMatch) return null;
    const nroAbonado = accountMatch[1];

    // 2. Extract Event Code (Contact ID style)
    // Looking for |CODE ZONE
    // e.g., |1130 01 001 -> 130 is Burglary, 01 is Partition, 001 is Zone
    const cidMatch = raw.match(/\|([1-9])([0-9]{3})\s([0-9]{2})\s([0-9]{3})/);
    let type = 'GENERAL';
    let severidad = 'MEDIA';
    let code = 'UNKNOWN';
    let zona = null;

    if (cidMatch) {
      const qualifier = cidMatch[1]; // 1 = Alarm, 3 = Restore
      code = cidMatch[2];
      zona = cidMatch[4];

      // Basic Mapping SIA/CID to Taxonomía CustOS
      if (code === '130' || code === '131') {
        type = 'INTRUSION';
        severidad = 'ALTA';
      } else if (code === '120' || code === '121') {
        type = 'PANICO';
        severidad = 'CRITICA';
      } else if (code === '110') {
        type = 'FUEGO';
        severidad = 'CRITICA';
      }

      if (qualifier === '3') {
        type = `RESTAURO_${type}`;
        severidad = 'BAJA';
      }
    }

    // 3. Find Device by nro_abonado
    // Note: We need a tenant-less lookup for initial ingestion, or require unique abonados across all tenants
    // The schema has @@unique([tenant_id, nro_abonado]) but we might want a global lookup for speed
    const device = await this.prisma.dispositivo.findFirst({
      where: { nro_abonado: nroAbonado },
      include: { tenant: true },
    });

    if (!device) {
      this.logger.warn(`Event from unknown account: ${nroAbonado}`);
      return null;
    }

    return {
      tenant_id: device.tenant_id,
      objetivo_id: device.objetivo_id,
      dispositivo_id: device.id,
      zona_id: zona ? await this.findOrCreateZona(device.id, zona) : null,
      origen: 'PANEL',
      codigo_crudo: code,
      tipo: type,
      severidad: severidad,
      id_origen: raw.match(/\"(\d+)\"/)?.[1] || Date.now().toString(),
      crudo: { full: raw },
    };
  }

  private async findOrCreateZona(dispositivoId: string, numero: string) {
    const existing = await this.prisma.zona.findFirst({
      where: { dispositivo_id: dispositivoId, numero_zona: numero },
    });
    if (existing) return existing.id;

    // Auto-onboard zone if it doesn't exist
    // Note: In a strict system, we might want to manually onboard zones
    return null;
  }
}

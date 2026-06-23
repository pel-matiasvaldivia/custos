import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { COGateway } from '../centro-operaciones/gateways/co.gateway';

@Injectable()
export class VigilanciaMovilService {
  private readonly logger = new Logger(VigilanciaMovilService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coGateway: COGateway,
  ) {}

  async registrarPuntoControl(
    vigilanteId: string,
    checkpointId: string,
    location?: { lat: number; lng: number },
  ) {
    // Check if checkpoint exists
    const checkpoint = await this.prisma.dispositivo.findFirst({
      where: { id: checkpointId, tipo: 'PUNTO_CONTROL' },
    });

    if (!checkpoint) throw new Error('Punto de control no válido');

    // Create a normalized EVENT for the SOC instead of a custom bitacora for now
    const event = await this.prisma.evento.create({
      data: {
        tenant_id: checkpoint.tenant_id,
        objetivo_id: checkpoint.objetivo_id,
        dispositivo_id: checkpointId,
        origen: 'RONDA',
        tipo: 'RONDA_CHECKPOINT',
        severidad: 'INFO',
        crudo: { vigilante_id: vigilanteId, location },
        ts_evento: new Date(),
      },
      include: { objetivo: true },
    });

    // Notify SOC Gateway
    this.coGateway.emitToTenant(checkpoint.tenant_id, 'event.new', event);

    return event;
  }

  async dispararPanico(
    vigilanteId: string,
    tenantId: string,
    location: { lat: number; lng: number },
  ) {
    this.logger.warn(
      `PANIC TRIGGERED by Vigilante ${vigilanteId} at ${location.lat}, ${location.lng}`,
    );

    // Fetch the objective the vigilante is assigned to (simplified: first objective of tenant for this mock)
    const objective = await this.prisma.objetivo.findFirst({
      where: { tenant_id: tenantId },
    });
    if (!objective) throw new Error('No objective found for tenant');

    // Create a CRITICAL Incident in the SOC
    const incident = await this.prisma.incidente.create({
      data: {
        tenant_id: tenantId,
        objetivo_id: objective.id,
        codigo: `PAN-${Date.now().toString().slice(-6)}`,
        tipo: 'PANICO_MOVIL',
        severidad: 'CRITICA',
        estado: 'NUEVO',
        resumen: `¡BOTÓN DE PÁNICO ACTIVADO! Vigilador ID: ${vigilanteId}. Ubicación: ${location.lat}, ${location.lng}`,
        abierto_el: new Date(),
      },
      include: { objetivo: true },
    });

    // Emit to SOC Console immediately
    this.coGateway.emitToTenant(tenantId, 'incident.new', incident);

    return incident;
  }

  async updateLocation(
    vigilanteId: string,
    tenantId: string,
    location: { lat: number; lng: number },
  ) {
    this.coGateway.emitToTenant(tenantId, 'vigilante.location', {
      vigilanteId,
      ...location,
      ts: new Date(),
    });
    return { success: true };
  }
}

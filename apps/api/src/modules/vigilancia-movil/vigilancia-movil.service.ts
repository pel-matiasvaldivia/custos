import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const checkpoint = await this.prisma.puntoControl.findUnique({
      where: { id: checkpointId },
      include: { puesto: true },
    });

    if (!checkpoint) throw new NotFoundException('Punto de control no válido');

    const payload = {
      vigilante_id: vigilanteId,
      punto_control_id: checkpointId,
      puesto_id: checkpoint.puesto_id,
      location,
      ts: new Date(),
    };

    this.coGateway.emitToTenant(checkpoint.tenant_id, 'ronda.checkpoint', payload);

    return payload;
  }

  async dispararPanico(
    vigilanteId: string,
    tenantId: string,
    location: { lat: number; lng: number },
  ) {
    this.logger.warn(
      `PANIC TRIGGERED by Vigilante ${vigilanteId} at ${location.lat}, ${location.lng}`,
    );

    const objective = await this.prisma.objetivo.findFirst({
      where: { tenant_id: tenantId },
    });
    if (!objective) throw new NotFoundException('No se encontró objetivo para el tenant');

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

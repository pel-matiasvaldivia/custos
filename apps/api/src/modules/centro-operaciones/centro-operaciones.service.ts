import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { COGateway } from './gateways/co.gateway';

@Injectable()
export class CentroOperacionesService {
  private readonly logger = new Logger(CentroOperacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coGateway: COGateway,
  ) {}

  async processEvent(data: any) {
    const { tenant_id, objetivo_id, dispositivo_id, tipo, severidad, id_origen } = data;

    // 1. Deduplication (Idempotencia)
    if (id_origen) {
      const existing = await this.prisma.evento.findFirst({
        where: { tenant_id, dispositivo_id, id_origen },
      });
      if (existing) {
        this.logger.log(`Duplicate event ignored: ${id_origen}`);
        return existing;
      }
    }

    // 2. Persist Event
    const event = await this.prisma.evento.create({
      data: {
        tenant_id,
        objetivo_id,
        dispositivo_id,
        zona_id: data.zona_id,
        tipo,
        severidad,
        origen: data.origen,
        codigo_crudo: data.codigo_crudo,
        crudo: data.crudo || {},
        id_origen,
      },
    });

    // 3. Simple Correlation Logic: If CRITICA or ALTA, check for open incident or create one
    if (severidad === 'CRITICA' || severidad === 'ALTA' || tipo === 'INTRUSION') {
      await this.handleIncidentTrigger(event);
    }

    // 4. Real-time push
    this.coGateway.emitToTenant(tenant_id, 'event.new', event);

    return event;
  }

  private async handleIncidentTrigger(event: any) {
    // Check for open incident in the last 5 minutes for the same objective
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    let incident = await this.prisma.incidente.findFirst({
      where: {
        tenant_id: event.tenant_id,
        objetivo_id: event.objetivo_id,
        estado: { notIn: ['RESUELTO'] },
        abierto_el: { gte: fiveMinsAgo },
      },
      orderBy: { abierto_el: 'desc' },
    });

    if (!incident) {
      const count = await this.prisma.incidente.count({ where: { tenant_id: event.tenant_id } });
      const codigo = `INC-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
      
      incident = await this.prisma.incidente.create({
        data: {
          tenant_id: event.tenant_id,
          objetivo_id: event.objetivo_id,
          codigo,
          tipo: event.tipo,
          severidad: event.severidad,
        },
      });
      this.coGateway.emitToTenant(event.tenant_id, 'incident.new', incident);
    }

    // Associate event with incident
    await this.prisma.evento.update({
      where: { id: event.id },
      data: { incidente_id: incident.id },
    });

    this.coGateway.emitToTenant(event.tenant_id, 'incident.updated', incident);
  }

  async getActiveIncidents(tenantId: string) {
    return this.prisma.incidente.findMany({
      where: { tenant_id: tenantId, estado: { not: 'RESUELTO' } },
      include: { objetivo: true, eventos: { orderBy: { ts_evento: 'desc' }, take: 5 } },
      orderBy: { abierto_el: 'desc' },
    });
  }

  async takeIncident(incidentId: string, operatorId: string) {
    const incident = await this.prisma.incidente.update({
      where: { id: incidentId },
      data: {
        estado: 'EN_ATENCION',
        operador_id: operatorId,
        tomado_el: new Date(),
      },
    });

    await this.prisma.incidenteBitacora.create({
      data: {
        tenant_id: incident.tenant_id,
        incidente_id: incident.id,
        actor_id: operatorId,
        accion: 'TOMAR',
      },
    });

    this.coGateway.emitToTenant(incident.tenant_id, 'incident.updated', incident);
    return incident;
  }

  async resolveIncident(incidentId: string, data: { disposicion: string, resumen: string }) {
    const incident = await this.prisma.incidente.update({
      where: { id: incidentId },
      data: {
        estado: 'RESUELTO',
        resuelto_el: new Date(),
        disposicion: data.disposicion,
        resumen: data.resumen,
      },
    });

    await this.prisma.incidenteBitacora.create({
      data: {
        tenant_id: incident.tenant_id,
        incidente_id: incident.id,
        accion: 'CIERRE',
        detalle: { disposicion: data.disposicion, resumen: data.resumen },
      },
    });

    this.coGateway.emitToTenant(incident.tenant_id, 'incident.resolved', incident);
    return incident;
  }
}

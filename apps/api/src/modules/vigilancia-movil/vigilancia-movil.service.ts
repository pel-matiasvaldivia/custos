import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { COGateway } from '../centro-operaciones/gateways/co.gateway';

@Injectable()
export class VigilanciaMovilService {
  private readonly logger = new Logger(VigilanciaMovilService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coGateway: COGateway,
  ) {}

  /**
   * Idempotencia para acciones encoladas offline: devuelve true si el
   * client_event_id ya se procesó (para no reaplicar). Si no, no hace nada.
   */
  private async yaProcesado(
    tenantId: string,
    clientEventId?: string,
  ): Promise<boolean> {
    if (!clientEventId) return false;
    const existe = await this.prisma.mobileEvento.findUnique({
      where: {
        tenant_id_client_event_id: {
          tenant_id: tenantId,
          client_event_id: clientEventId,
        },
      },
      select: { id: true },
    });
    return !!existe;
  }

  private async registrarEvento(
    tenantId: string,
    vigiladorId: string,
    clientEventId: string | undefined,
    tipo: string,
    ts: Date,
  ): Promise<void> {
    if (!clientEventId) return;
    await this.prisma.mobileEvento
      .create({
        data: {
          tenant_id: tenantId,
          vigilador_id: vigiladorId,
          client_event_id: clientEventId,
          tipo,
          ts,
        },
      })
      .catch(() => undefined); // choque por unicidad = ya registrado, se ignora
  }

  /** Fecha del evento: la que reporta el dispositivo (acción real, aunque se
   *  sincronice más tarde) o, si no viene, la del servidor. */
  private cuando(ts?: string): Date {
    if (ts) {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }

  async registrarPuntoControl(
    tenantId: string,
    vigiladorId: string,
    checkpointId: string,
    location?: { lat: number; lng: number },
    clientEventId?: string,
    ts?: string,
  ) {
    if (await this.yaProcesado(tenantId, clientEventId)) {
      return { duplicated: true };
    }

    const checkpoint = await this.prisma.puntoControl.findUnique({
      where: { id: checkpointId },
      include: { puesto: true },
    });

    if (!checkpoint) throw new NotFoundException('Punto de control no válido');

    const cuando = this.cuando(ts);
    const payload = {
      vigilante_id: vigiladorId,
      punto_control_id: checkpointId,
      puesto_id: checkpoint.puesto_id,
      location,
      ts: cuando,
    };

    this.coGateway.emitToTenant(
      checkpoint.tenant_id,
      'ronda.checkpoint',
      payload,
    );

    await this.registrarEvento(tenantId, vigiladorId, clientEventId, 'checkpoint', cuando);
    return payload;
  }

  async dispararPanico(
    vigiladorId: string,
    tenantId: string,
    location: { lat: number; lng: number },
    clientEventId?: string,
    ts?: string,
  ) {
    if (await this.yaProcesado(tenantId, clientEventId)) {
      return { duplicated: true };
    }

    this.logger.warn(
      `PANIC TRIGGERED by Vigilador ${vigiladorId} at ${location?.lat}, ${location?.lng}`,
    );

    const objective = await this.prisma.objetivo.findFirst({
      where: { tenant_id: tenantId },
    });
    if (!objective)
      throw new NotFoundException('No se encontró objetivo para el tenant');

    const cuando = this.cuando(ts);
    const incident = await this.prisma.incidente.create({
      data: {
        tenant_id: tenantId,
        objetivo_id: objective.id,
        codigo: `PAN-${Date.now().toString().slice(-6)}`,
        tipo: 'PANICO_MOVIL',
        severidad: 'CRITICA',
        estado: 'NUEVO',
        resumen: `¡BOTÓN DE PÁNICO ACTIVADO! Vigilador ID: ${vigiladorId}. Ubicación: ${location?.lat}, ${location?.lng}`,
        abierto_el: cuando,
      },
      include: { objetivo: true },
    });

    this.coGateway.emitToTenant(tenantId, 'incident.new', incident);

    await this.registrarEvento(tenantId, vigiladorId, clientEventId, 'panic', cuando);
    return incident;
  }

  async updateLocation(
    vigiladorId: string,
    tenantId: string,
    location: { lat: number; lng: number },
  ) {
    this.coGateway.emitToTenant(tenantId, 'vigilante.location', {
      vigiladorId,
      ...location,
      ts: new Date(),
    });
    return { success: true };
  }

  /** Turno en curso, o si no hay ninguno, el próximo turno planificado. */
  async turnoActual(tenantId: string, vigiladorId: string) {
    const ahora = new Date();

    const enCurso = await this.prisma.turnoPlanificado.findFirst({
      where: {
        tenant_id: tenantId,
        vigilador_id: vigiladorId,
        inicio_plan: { lte: ahora },
        fin_plan: { gte: ahora },
      },
      orderBy: { inicio_plan: 'asc' },
    });

    const turno =
      enCurso ??
      (await this.prisma.turnoPlanificado.findFirst({
        where: {
          tenant_id: tenantId,
          vigilador_id: vigiladorId,
          inicio_plan: { gt: ahora },
        },
        orderBy: { inicio_plan: 'asc' },
      }));

    if (!turno) return null;

    const puesto = await this.prisma.puesto.findFirst({
      where: { id: turno.puesto_id, tenant_id: tenantId, deleted_at: null },
      select: { id: true, nombre: true, ubicacion: true },
    });

    return { ...turno, puesto, enCurso: !!enCurso };
  }

  private async turnoDelVigilador(
    tenantId: string,
    vigiladorId: string,
    turnoId: string,
  ) {
    const turno = await this.prisma.turnoPlanificado.findFirst({
      where: { id: turnoId, tenant_id: tenantId },
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    if (turno.vigilador_id !== vigiladorId) {
      throw new ForbiddenException('El turno no pertenece a este vigilador');
    }
    return turno;
  }

  async checkin(
    tenantId: string,
    vigiladorId: string,
    turnoId: string,
    metodo: string,
    location?: { lat: number; lng: number },
    clientEventId?: string,
    ts?: string,
  ) {
    const turno = await this.turnoDelVigilador(tenantId, vigiladorId, turnoId);

    // Idempotencia: si ya se procesó este evento (reintento offline), no-op.
    if (await this.yaProcesado(tenantId, clientEventId)) return turno;

    if (turno.inicio_real) {
      // Ya tiene ingreso: si viene de la cola offline lo tomamos como éxito
      // idempotente; en el flujo online normal seguimos avisando el doble.
      if (clientEventId) {
        await this.registrarEvento(tenantId, vigiladorId, clientEventId, 'checkin', turno.inicio_real);
        return turno;
      }
      throw new BadRequestException('Ya se registró el ingreso de este turno');
    }

    const cuando = this.cuando(ts);
    const actualizado = await this.prisma.turnoPlanificado.update({
      where: { id: turno.id },
      data: { inicio_real: cuando, metodo, asistencia_estado: 'OK' },
    });

    this.coGateway.emitToTenant(tenantId, 'asistencia.checkin', {
      turnoId: turno.id,
      vigiladorId,
      location,
      ts: cuando,
    });

    await this.registrarEvento(tenantId, vigiladorId, clientEventId, 'checkin', cuando);
    return actualizado;
  }

  async checkout(
    tenantId: string,
    vigiladorId: string,
    turnoId: string,
    metodo: string,
    location?: { lat: number; lng: number },
    clientEventId?: string,
    ts?: string,
  ) {
    const turno = await this.turnoDelVigilador(tenantId, vigiladorId, turnoId);

    if (await this.yaProcesado(tenantId, clientEventId)) return turno;

    if (!turno.inicio_real) {
      throw new BadRequestException(
        'No se puede marcar la salida sin haber marcado el ingreso',
      );
    }
    if (turno.fin_real) {
      if (clientEventId) {
        await this.registrarEvento(tenantId, vigiladorId, clientEventId, 'checkout', turno.fin_real);
        return turno;
      }
      throw new BadRequestException('Ya se registró la salida de este turno');
    }

    const cuando = this.cuando(ts);
    const actualizado = await this.prisma.turnoPlanificado.update({
      where: { id: turno.id },
      data: { fin_real: cuando, metodo },
    });

    this.coGateway.emitToTenant(tenantId, 'asistencia.checkout', {
      turnoId: turno.id,
      vigiladorId,
      location,
      ts: cuando,
    });

    await this.registrarEvento(tenantId, vigiladorId, clientEventId, 'checkout', cuando);
    return actualizado;
  }
}

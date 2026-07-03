import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { COGateway } from '../centro-operaciones/gateways/co.gateway';
import { CatalogoService } from '../../catalogo/catalogo.service';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class VigilanciaMovilService {
  private readonly logger = new Logger(VigilanciaMovilService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coGateway: COGateway,
    private readonly catalogo: CatalogoService,
    private readonly storage: StorageService,
  ) {}

  /** Tipos de novedad predefinidos (catálogo NOVEDAD_TIPO del tenant). */
  async listarNovedadTipos(tenantId: string) {
    return this.catalogo.findAll(tenantId, 'NOVEDAD_TIPO');
  }

  /** Crea una novedad desde el móvil, con adjuntos (foto/audio) opcionales. */
  async crearNovedad(
    tenantId: string,
    vigiladorId: string,
    data: {
      tipo: string;
      descripcion: string;
      prioridad?: string;
      clientEventId?: string;
      ts?: string;
    },
    archivos: Array<{
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    }> = [],
  ) {
    if (await this.yaProcesado(tenantId, data.clientEventId)) {
      return { duplicated: true };
    }

    // Puesto del turno en curso (si lo hay), para ubicar la novedad.
    const turno = await this.turnoActual(tenantId, vigiladorId);
    const puestoId = turno?.enCurso ? turno.puesto_id : undefined;

    const adjuntos: string[] = [];
    for (const a of archivos) {
      const subida = await this.storage.subir(
        a.buffer,
        a.originalname || 'adjunto',
        a.mimetype || 'application/octet-stream',
        'novedades',
      );
      adjuntos.push(subida.key);
    }

    const cuando = this.cuando(data.ts);
    const novedad = await this.prisma.novedad.create({
      data: {
        tenant_id: tenantId,
        vigilador_id: vigiladorId,
        puesto_id: puestoId,
        tipo: data.tipo,
        prioridad: data.prioridad ?? 'NORMAL',
        descripcion: data.descripcion,
        adjuntos,
        created_at: cuando,
      },
    });

    this.coGateway.emitToTenant(tenantId, 'novedad.new', {
      id: novedad.id,
      tipo: novedad.tipo,
      vigiladorId,
      puestoId,
      ts: cuando,
    });

    await this.registrarEvento(
      tenantId,
      vigiladorId,
      data.clientEventId,
      'novedad',
      cuando,
    );
    return novedad;
  }

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

  /**
   * Resuelve el vigilador que ejecuta la acción.
   *  - Token de vigilador (login personal): es el del propio token.
   *  - Token de dispositivo (un celular por objetivo): el vigilador viene en el
   *    payload y se valida que esté asignado a ese objetivo (se identificó).
   */
  async resolverVigilador(
    user: {
      tipo: string;
      vigiladorId?: string;
      objetivoId?: string;
      tenantId: string;
    },
    vigiladorIdPayload?: string,
  ): Promise<string> {
    if (user.tipo === 'VIGILADOR' && user.vigiladorId) {
      return user.vigiladorId;
    }
    if (!vigiladorIdPayload) {
      throw new BadRequestException(
        'Identificate: elegí tu nombre antes de continuar.',
      );
    }
    const asignado = await this.esVigiladorDelObjetivo(
      user.tenantId,
      user.objetivoId!,
      vigiladorIdPayload,
    );
    if (!asignado) {
      throw new ForbiddenException(
        'Ese vigilador no está asignado a este objetivo.',
      );
    }
    return vigiladorIdPayload;
  }

  /** IDs de los puestos (no eliminados) de un objetivo. */
  private async puestoIdsDeObjetivo(
    tenantId: string,
    objetivoId: string,
  ): Promise<string[]> {
    const puestos = await this.prisma.puesto.findMany({
      where: { tenant_id: tenantId, objetivo_id: objetivoId, deleted_at: null },
      select: { id: true },
    });
    return puestos.map((p) => p.id);
  }

  /** ¿El vigilador tiene turnos en algún puesto de este objetivo? */
  private async esVigiladorDelObjetivo(
    tenantId: string,
    objetivoId: string,
    vigiladorId: string,
  ): Promise<boolean> {
    const puestoIds = await this.puestoIdsDeObjetivo(tenantId, objetivoId);
    if (puestoIds.length === 0) return false;
    const turno = await this.prisma.turnoPlanificado.findFirst({
      where: {
        tenant_id: tenantId,
        vigilador_id: vigiladorId,
        puesto_id: { in: puestoIds },
      },
      select: { id: true },
    });
    return !!turno;
  }

  /**
   * Vigiladores asignados al objetivo del dispositivo, con el estado de su turno
   * (en curso / próximo / sin turno) — alimenta el selector "¿Quién sos?".
   */
  async vigiladoresDelObjetivo(tenantId: string, objetivoId: string) {
    const ahora = new Date();
    const desde = new Date(ahora.getTime() - 14 * 24 * 60 * 60 * 1000);
    const hasta = new Date(ahora.getTime() + 14 * 24 * 60 * 60 * 1000);

    const puestoIds = await this.puestoIdsDeObjetivo(tenantId, objetivoId);
    if (puestoIds.length === 0) return [];

    const turnos = await this.prisma.turnoPlanificado.findMany({
      where: {
        tenant_id: tenantId,
        puesto_id: { in: puestoIds },
        inicio_plan: { gte: desde, lte: hasta },
      },
      orderBy: { inicio_plan: 'asc' },
      select: {
        id: true,
        vigilador_id: true,
        inicio_plan: true,
        fin_plan: true,
        inicio_real: true,
        fin_real: true,
      },
    });

    const vigiladorIds = [...new Set(turnos.map((t) => t.vigilador_id))];
    if (vigiladorIds.length === 0) return [];

    const vigiladores = await this.prisma.vigilador.findMany({
      where: { id: { in: vigiladorIds }, tenant_id: tenantId, estado: 'ACTIVO' },
      select: { id: true, nombre: true, apellido: true, legajo_nro: true },
    });

    return vigiladores.map((v) => {
      const suyos = turnos.filter((t) => t.vigilador_id === v.id);
      const enCurso = suyos.find(
        (t) => t.inicio_plan <= ahora && t.fin_plan >= ahora,
      );
      const proximo = suyos.find((t) => t.inicio_plan > ahora);
      const turnoRef = enCurso ?? proximo ?? null;
      return {
        id: v.id,
        nombre: v.nombre,
        apellido: v.apellido,
        legajo_nro: v.legajo_nro,
        estado_turno: enCurso ? 'EN_TURNO' : proximo ? 'PROXIMO' : 'SIN_TURNO',
        turno: turnoRef
          ? {
              id: turnoRef.id,
              inicio_plan: turnoRef.inicio_plan,
              fin_plan: turnoRef.fin_plan,
              inicio_real: turnoRef.inicio_real,
              fin_real: turnoRef.fin_real,
            }
          : null,
      };
    });
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

    // El QR puede codificar el codigo_qr del punto o directamente su id.
    // Solo comparamos contra id si tiene forma de UUID (la columna es uuid).
    const esUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        checkpointId ?? '',
      );
    const checkpoint = await this.prisma.puntoControl.findFirst({
      where: {
        tenant_id: tenantId,
        OR: [
          { codigo_qr: checkpointId },
          ...(esUuid ? [{ id: checkpointId }] : []),
        ],
      },
      include: { puesto: true },
    });

    if (!checkpoint) throw new NotFoundException('Punto de control no válido');

    const cuando = this.cuando(ts);

    // Si el vigilador tiene una ronda en progreso, el scan queda como marca
    // (evidencia); al cubrir todos los puntos de la plantilla, se completa.
    let ronda: {
      id: string;
      marcados: number;
      total: number;
      completada: boolean;
    } | null = null;
    const rondaActiva = await this.prisma.ronda.findFirst({
      where: {
        tenant_id: tenantId,
        vigilador_id: vigiladorId,
        estado: 'EN_PROGRESO',
      },
      orderBy: { hora_inicio: 'desc' },
      include: {
        plantilla: { include: { puntos: true } },
        marcas: { select: { punto_control_id: true } },
      },
    });

    if (rondaActiva) {
      const yaMarcado = rondaActiva.marcas.some(
        (m: { punto_control_id: string }) =>
          m.punto_control_id === checkpoint.id,
      );
      if (!yaMarcado) {
        await this.prisma.marcaRonda.create({
          data: {
            ronda_id: rondaActiva.id,
            punto_control_id: checkpoint.id,
            timestamp: cuando,
            lat: location?.lat,
            lng: location?.lng,
          },
        });
      }

      const marcadosIds = new Set(
        rondaActiva.marcas.map(
          (m: { punto_control_id: string }) => m.punto_control_id,
        ),
      );
      marcadosIds.add(checkpoint.id);
      const puntosPlantilla: string[] =
        rondaActiva.plantilla?.puntos.map(
          (p: { punto_control_id: string }) => p.punto_control_id,
        ) ?? [];
      const total = puntosPlantilla.length;
      const marcados = puntosPlantilla.filter((id) =>
        marcadosIds.has(id),
      ).length;
      const completada = total > 0 && marcados >= total;

      if (completada) {
        await this.prisma.ronda.update({
          where: { id: rondaActiva.id },
          data: { estado: 'COMPLETADA', hora_fin: cuando },
        });
      }
      ronda = { id: rondaActiva.id, marcados, total, completada };
    }

    const payload = {
      vigilante_id: vigiladorId,
      punto_control_id: checkpoint.id,
      punto_nombre: checkpoint.nombre,
      puesto_id: checkpoint.puesto_id,
      location,
      ts: cuando,
      ronda,
    };

    this.coGateway.emitToTenant(
      checkpoint.tenant_id,
      'ronda.checkpoint',
      payload,
    );

    await this.registrarEvento(
      tenantId,
      vigiladorId,
      clientEventId,
      'checkpoint',
      cuando,
    );
    return payload;
  }

  /**
   * Rondas asignadas al objetivo del turno actual del vigilador, con el estado
   * de la ejecución en curso (o la última dentro del turno) y sus marcas.
   */
  async rondasDelTurno(tenantId: string, vigiladorId: string) {
    const turno = await this.turnoActual(tenantId, vigiladorId);
    if (!turno?.puesto) return [];

    const puesto = await this.prisma.puesto.findFirst({
      where: { id: turno.puesto.id, tenant_id: tenantId },
      select: { objetivo_id: true },
    });
    if (!puesto?.objetivo_id) return [];

    const plantillas = await this.prisma.rondaPlantilla.findMany({
      where: {
        tenant_id: tenantId,
        objetivo_id: puesto.objetivo_id,
        activa: true,
      },
      orderBy: { created_at: 'asc' },
      include: {
        puntos: {
          orderBy: { orden: 'asc' },
          include: {
            punto_control: {
              select: { id: true, nombre: true, codigo_qr: true },
            },
          },
        },
      },
    });
    if (plantillas.length === 0) return [];

    // Última ejecución de cada plantilla dentro del turno (en curso o cerrada).
    const ejecuciones = await this.prisma.ronda.findMany({
      where: {
        tenant_id: tenantId,
        vigilador_id: vigiladorId,
        plantilla_id: { in: plantillas.map((p: { id: string }) => p.id) },
        hora_inicio: { gte: turno.inicio_plan },
      },
      orderBy: { hora_inicio: 'desc' },
      include: {
        marcas: { select: { punto_control_id: true, timestamp: true } },
      },
    });

    return plantillas.map(
      (pl: {
        id: string;
        nombre: string;
        tolerancia_min: number | null;
        puntos: Array<{
          orden: number;
          punto_control: {
            id: string;
            nombre: string;
            codigo_qr: string | null;
          };
        }>;
      }) => {
        const ejecucion = ejecuciones.find(
          (e: { plantilla_id: string | null }) => e.plantilla_id === pl.id,
        );
        const marcas = new Map<string, Date>(
          (ejecucion?.marcas ?? []).map(
            (m: { punto_control_id: string; timestamp: Date }) =>
              [m.punto_control_id, m.timestamp] as [string, Date],
          ),
        );
        return {
          id: pl.id,
          nombre: pl.nombre,
          tolerancia_min: pl.tolerancia_min,
          puntos: pl.puntos.map((p) => ({
            id: p.punto_control.id,
            nombre: p.punto_control.nombre,
            codigo_qr: p.punto_control.codigo_qr,
            orden: p.orden,
            marcada: marcas.get(p.punto_control.id) ?? null,
          })),
          ejecucion: ejecucion
            ? {
                id: ejecucion.id,
                estado: ejecucion.estado,
                hora_inicio: ejecucion.hora_inicio,
                hora_fin: ejecucion.hora_fin,
              }
            : null,
        };
      },
    );
  }

  /** Inicia una ejecución de ronda a partir de una plantilla (idempotente offline). */
  async iniciarRonda(
    tenantId: string,
    vigiladorId: string,
    plantillaId: string,
    clientEventId?: string,
    ts?: string,
  ) {
    if (await this.yaProcesado(tenantId, clientEventId)) {
      return { duplicated: true };
    }

    const plantilla = await this.prisma.rondaPlantilla.findFirst({
      where: { id: plantillaId, tenant_id: tenantId, activa: true },
      include: { puntos: { include: { punto_control: true } } },
    });
    if (!plantilla) throw new NotFoundException('Ronda no encontrada');

    // Si ya hay una en progreso de esta plantilla, se reutiliza (reintento offline).
    const existente = await this.prisma.ronda.findFirst({
      where: {
        tenant_id: tenantId,
        vigilador_id: vigiladorId,
        plantilla_id: plantillaId,
        estado: 'EN_PROGRESO',
      },
    });
    if (existente) return existente;

    const turno = await this.turnoActual(tenantId, vigiladorId);
    const puestoId =
      turno?.puesto?.id ?? plantilla.puntos[0]?.punto_control.puesto_id;
    if (!puestoId) {
      throw new BadRequestException('La ronda no tiene puntos de control.');
    }

    const cuando = this.cuando(ts);
    const ronda = await this.prisma.ronda.create({
      data: {
        tenant_id: tenantId,
        puesto_id: puestoId,
        vigilador_id: vigiladorId,
        plantilla_id: plantillaId,
        nombre: plantilla.nombre,
        hora_inicio: cuando,
        estado: 'EN_PROGRESO',
      },
    });

    this.coGateway.emitToTenant(tenantId, 'ronda.start', {
      rondaId: ronda.id,
      plantillaId,
      vigiladorId,
      ts: cuando,
    });

    await this.registrarEvento(
      tenantId,
      vigiladorId,
      clientEventId,
      'ronda_inicio',
      cuando,
    );
    return ronda;
  }

  async dispararPanico(
    vigiladorId: string,
    tenantId: string,
    location: { lat: number; lng: number },
    clientEventId?: string,
    ts?: string,
    objetivoId?: string,
  ) {
    if (await this.yaProcesado(tenantId, clientEventId)) {
      return { duplicated: true };
    }

    this.logger.warn(
      `PANIC TRIGGERED by Vigilador ${vigiladorId} at ${location?.lat}, ${location?.lng}`,
    );

    // Modo dispositivo: el objetivo lo conocemos del token. Modo personal: se
    // usa el puesto del turno en curso; como fallback, el primero del tenant.
    const objective = objetivoId
      ? await this.prisma.objetivo.findFirst({
          where: { id: objetivoId, tenant_id: tenantId },
        })
      : await this.prisma.objetivo.findFirst({ where: { tenant_id: tenantId } });
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

    await this.registrarEvento(
      tenantId,
      vigiladorId,
      clientEventId,
      'panic',
      cuando,
    );
    return incident;
  }

  async updateLocation(
    vigiladorId: string | undefined,
    tenantId: string,
    location: { lat: number; lng: number },
    objetivoId?: string,
  ) {
    this.coGateway.emitToTenant(tenantId, 'vigilante.location', {
      vigiladorId,
      objetivoId,
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
        await this.registrarEvento(
          tenantId,
          vigiladorId,
          clientEventId,
          'checkin',
          turno.inicio_real,
        );
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

    await this.registrarEvento(
      tenantId,
      vigiladorId,
      clientEventId,
      'checkin',
      cuando,
    );
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
        await this.registrarEvento(
          tenantId,
          vigiladorId,
          clientEventId,
          'checkout',
          turno.fin_real,
        );
        return turno;
      }
      throw new BadRequestException('Ya se registró la salida de este turno');
    }

    const cuando = this.cuando(ts);

    // Salida anticipada: no se permite marcar la salida antes del fin planificado
    // del turno; el guardia debe pedir un relevo. Validamos con `cuando` (el `ts`
    // del dispositivo = momento real en que se tocó "salir"), NO con la hora del
    // servidor: si el checkout se encoló offline antes de fin_plan y recién se
    // sincroniza más tarde, la intención original fue salir antes, así que se
    // rechaza igual. El frontend distingue este caso por el `code`.
    if (cuando < turno.fin_plan) {
      throw new BadRequestException({
        code: 'SALIDA_ANTICIPADA',
        turnoId: turno.id,
        finPlan: turno.fin_plan,
        message:
          'No se puede marcar la salida antes del fin del turno. Solicitá un relevo.',
      });
    }

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

    await this.registrarEvento(
      tenantId,
      vigiladorId,
      clientEventId,
      'checkout',
      cuando,
    );
    return actualizado;
  }
}

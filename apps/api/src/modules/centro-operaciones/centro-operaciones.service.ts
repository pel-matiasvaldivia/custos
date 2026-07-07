import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { COGateway } from './gateways/co.gateway';
import { mismaFamilia } from './incidente-familias';
import { HikvisionService } from './hikvision/hikvision.service';
import { SecretosService } from '../../common/crypto/secretos.service';
import {
  CrearDispositivoDto,
  ActualizarDispositivoDto,
  ActualizarCanalDto,
  ProbarDispositivoDto,
} from './dto/dispositivo.dto';

@Injectable()
export class CentroOperacionesService {
  private readonly logger = new Logger(CentroOperacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coGateway: COGateway,
    private readonly hik: HikvisionService,
    private readonly secretos: SecretosService,
  ) {}

  async processEvent(data: any) {
    const {
      tenant_id,
      objetivo_id,
      dispositivo_id,
      tipo,
      severidad,
      id_origen,
    } = data;

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
    // Se incluye el objetivo para que el stream en vivo del SOC pueda mostrar
    // el nombre (el payload de 'event.new' es este mismo registro).
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
        canal_numero: data.canal_numero ?? null,
        snapshot_key: data.snapshot_key ?? null,
        en_prueba: data.en_prueba ?? false,
        crudo: data.crudo || {},
        id_origen,
      },
      include: { objetivo: { select: { id: true, nombre: true } } },
    });

    // 3. Update Device Health
    await this.prisma.dispositivo.update({
      where: { id: dispositivo_id },
      data: {
        ultimo_latido: new Date(),
        estado: 'EN_LINEA',
      },
    });

    // 4. Simple Correlation Logic: If CRITICA or ALTA, check for open incident or create one.
    // En modo prueba (walk-test) el evento queda registrado para auditoría pero
    // NO genera incidente en el SOC.
    if (
      !event.en_prueba &&
      (severidad === 'CRITICA' || severidad === 'ALTA' || tipo === 'INTRUSION')
    ) {
      await this.handleIncidentTrigger(event);
    }

    // 4. Real-time push
    this.coGateway.emitToTenant(tenant_id, 'event.new', event);

    return event;
  }

  private async handleIncidentTrigger(event: any) {
    // Check for open incident in the last 5 minutes for the same objective
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Incidentes abiertos del objetivo en la ventana. Solo fusionamos con uno de
    // la MISMA familia de respuesta (ver incidente-familias): un FUEGO y una
    // INTRUSION concurrentes son incidentes distintos porque disparan protocolos
    // distintos, y el `tipo` del incidente define la SOP.
    const abiertos = await this.prisma.incidente.findMany({
      where: {
        tenant_id: event.tenant_id,
        objetivo_id: event.objetivo_id,
        estado: { notIn: ['RESUELTO'] },
        abierto_el: { gte: fiveMinsAgo },
      },
      orderBy: { abierto_el: 'desc' },
    });

    let incident =
      abiertos.find((i) => mismaFamilia(i.tipo, event.tipo)) ?? null;

    if (!incident) {
      incident = await this.crearIncidente(event);
      this.coGateway.emitToTenant(event.tenant_id, 'incident.new', incident);
    }

    // Associate event with incident
    await this.prisma.evento.update({
      where: { id: event.id },
      data: { incidente_id: incident.id },
    });

    this.coGateway.emitToTenant(event.tenant_id, 'incident.updated', incident);
  }

  /**
   * Crea un incidente con código correlativo por (tenant, año). El número se toma
   * de un contador atómico (incidente_contador) vía upsert+increment, que compila
   * a `INSERT ... ON CONFLICT DO UPDATE SET valor = valor + 1`: dos eventos
   * concurrentes (p. ej. varias zonas de un panel por el receptor SIA) obtienen
   * números distintos, sin la race condition del count()+1. Reinicia en 0001 cada
   * año porque el año es parte de la clave del contador. Si aun así un código
   * quedara tomado por otra vía (choque P2002 sobre @@unique([tenant_id, codigo])),
   * se reintenta tomando el siguiente número, hasta 3 veces.
   */
  private async crearIncidente(event: any) {
    const anio = new Date().getFullYear();
    const MAX_INTENTOS = 3;

    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
      const { valor } = await this.prisma.incidenteContador.upsert({
        where: { tenant_id_anio: { tenant_id: event.tenant_id, anio } },
        create: { tenant_id: event.tenant_id, anio, valor: 1 },
        update: { valor: { increment: 1 } },
        select: { valor: true },
      });
      const codigo = `INC-${anio}-${valor.toString().padStart(4, '0')}`;

      try {
        return await this.prisma.incidente.create({
          data: {
            tenant_id: event.tenant_id,
            objetivo_id: event.objetivo_id,
            codigo,
            tipo: event.tipo,
            severidad: event.severidad,
          },
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002' &&
          intento < MAX_INTENTOS
        ) {
          continue; // código tomado: reintentar con el siguiente número
        }
        throw e;
      }
    }

    throw new Error('No se pudo generar un código de incidente único');
  }

  async getActiveIncidents(tenantId: string) {
    return this.prisma.incidente.findMany({
      where: { tenant_id: tenantId, estado: { not: 'RESUELTO' } },
      include: {
        objetivo: true,
        eventos: { orderBy: { ts_evento: 'desc' }, take: 5 },
      },
      orderBy: { abierto_el: 'desc' },
    });
  }

  /**
   * Incidentes RESUELTOS (pestaña "Cerrados" del SOC). Sin filtro de fechas
   * devuelve los últimos 100; con desde/hasta acota por fecha de cierre.
   */
  async getClosedIncidents(tenantId: string, desde?: string, hasta?: string) {
    const where: Prisma.IncidenteWhereInput = {
      tenant_id: tenantId,
      estado: 'RESUELTO',
    };
    if (desde || hasta) {
      where.resuelto_el = {
        gte: desde ? new Date(desde) : undefined,
        lte: hasta ? new Date(`${hasta}T23:59:59`) : undefined,
      };
    }
    return this.prisma.incidente.findMany({
      where,
      include: { objetivo: true },
      orderBy: { resuelto_el: 'desc' },
      take: 100,
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

    this.coGateway.emitToTenant(
      incident.tenant_id,
      'incident.updated',
      incident,
    );
    return incident;
  }

  /** Paso 2 del protocolo: verificación (llamar al guardia, ver cámara, etc.). */
  async verifyIncident(
    incidentId: string,
    operatorId: string,
    data: { metodo: string; nota?: string },
  ) {
    const incident = await this.prisma.incidente.update({
      where: { id: incidentId },
      data: { estado: 'VERIFICANDO', operador_id: operatorId },
    });
    await this.prisma.incidenteBitacora.create({
      data: {
        tenant_id: incident.tenant_id,
        incidente_id: incident.id,
        actor_id: operatorId,
        accion: 'VERIFICACION',
        detalle: { metodo: data.metodo, nota: data.nota ?? '' },
      },
    });
    this.coGateway.emitToTenant(
      incident.tenant_id,
      'incident.updated',
      incident,
    );
    return incident;
  }

  /** Paso 3 del protocolo: despacho de la respuesta (policía, móvil, supervisor…). */
  async dispatchIncident(
    incidentId: string,
    operatorId: string,
    data: { destino: string; nota?: string },
  ) {
    const incident = await this.prisma.incidente.update({
      where: { id: incidentId },
      data: {
        estado: 'DESPACHADO',
        operador_id: operatorId,
        despachado_el: new Date(),
      },
    });
    await this.prisma.incidenteBitacora.create({
      data: {
        tenant_id: incident.tenant_id,
        incidente_id: incident.id,
        actor_id: operatorId,
        accion: 'DESPACHO',
        detalle: { destino: data.destino, nota: data.nota ?? '' },
      },
    });
    this.coGateway.emitToTenant(
      incident.tenant_id,
      'incident.updated',
      incident,
    );
    return incident;
  }

  /** Nota libre en la bitácora (no cambia de estado). */
  async addNote(incidentId: string, operatorId: string, nota: string) {
    const incident = await this.prisma.incidente.findUniqueOrThrow({
      where: { id: incidentId },
      select: { id: true, tenant_id: true },
    });
    const entry = await this.prisma.incidenteBitacora.create({
      data: {
        tenant_id: incident.tenant_id,
        incidente_id: incident.id,
        actor_id: operatorId,
        accion: 'NOTA',
        detalle: { nota },
      },
    });
    this.coGateway.emitToTenant(incident.tenant_id, 'incident.updated', {
      id: incident.id,
    });
    return entry;
  }

  /** Detalle del incidente con su bitácora (timeline) y nombres de operadores. */
  async getIncident(incidentId: string, tenantId: string) {
    const incident = await this.prisma.incidente.findFirst({
      where: { id: incidentId, tenant_id: tenantId },
      include: {
        objetivo: true,
        eventos: { orderBy: { ts_evento: 'desc' }, take: 10 },
        bitacora: { orderBy: { ts: 'asc' } },
      },
    });
    if (!incident) return null;

    const actorIds = [
      ...new Set(
        incident.bitacora
          .map((b: { actor_id: string | null }) => b.actor_id)
          .filter((x): x is string => !!x),
      ),
    ];
    const actores = actorIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, nombre: true, email: true },
        })
      : [];
    const nombrePorId = new Map(
      actores.map((a: { id: string; nombre: string | null; email: string }) => [
        a.id,
        a.nombre || a.email,
      ]),
    );

    return {
      ...incident,
      bitacora: incident.bitacora.map(
        (b: { actor_id: string | null; [k: string]: unknown }) => ({
          ...b,
          actor_nombre: b.actor_id
            ? (nombrePorId.get(b.actor_id) ?? null)
            : null,
        }),
      ),
    };
  }

  async resolveIncident(
    incidentId: string,
    data: { disposicion: string; resumen: string },
    operatorId?: string,
  ) {
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
        actor_id: operatorId ?? null,
        accion: 'CIERRE',
        detalle: { disposicion: data.disposicion, resumen: data.resumen },
      },
    });

    this.coGateway.emitToTenant(
      incident.tenant_id,
      'incident.resolved',
      incident,
    );
    return incident;
  }

  /** Actualiza el latido de un equipo sin evento (heartbeat del Alarm Server). */
  async marcarLatido(dispositivoId: string) {
    await this.prisma.dispositivo.update({
      where: { id: dispositivoId },
      data: { ultimo_latido: new Date(), estado: 'EN_LINEA' },
    });
  }

  async getDevices(tenantId: string) {
    return this.prisma.dispositivo.findMany({
      where: { tenant_id: tenantId, deleted_at: null },
      include: {
        objetivo: { select: { id: true, nombre: true } },
        _count: { select: { canales: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // === F1 · Onboarding de dispositivos ======================================

  /** Prueba de conexión ISAPI sin persistir: devuelve identidad del equipo. */
  async probarConexion(dto: ProbarDispositivoDto) {
    try {
      const info = await this.hik.probarConexion({
        ip: dto.ip,
        puertoHttp: dto.puerto_http,
        usuario: dto.usuario,
        password: dto.password,
        https: dto.https,
      });
      return { ok: true, ...info };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }

  async crearDispositivo(tenantId: string, dto: CrearDispositivoDto) {
    const objetivo = await this.prisma.objetivo.findFirst({
      where: { id: dto.objetivo_id },
      select: { id: true },
    });
    if (!objetivo) throw new BadRequestException('Objetivo inexistente');

    const params = {
      ip: dto.ip,
      puerto_http: dto.puerto_http ?? 80,
      puerto_rtsp: dto.puerto_rtsp ?? 554,
      usuario: dto.usuario,
      secreto: this.secretos.cifrar(dto.password),
      https: !!dto.https,
      supervision_seg: 60,
    };

    return this.prisma.dispositivo.create({
      data: {
        tenant_id: tenantId,
        objetivo_id: dto.objetivo_id,
        tipo: dto.tipo,
        protocolo: dto.protocolo ?? 'ISAPI',
        marca: dto.marca ?? 'Hikvision',
        modelo: dto.modelo,
        nro_abonado: dto.nro_abonado,
        ingest_token: `hk_${randomBytes(16).toString('hex')}`,
        params,
      },
      include: { objetivo: { select: { id: true, nombre: true } } },
    });
  }

  async actualizarDispositivo(
    tenantId: string,
    id: string,
    dto: ActualizarDispositivoDto,
  ) {
    const disp = await this.cargarDispositivo(tenantId, id);
    const params = { ...((disp.params as Record<string, any>) || {}) };
    if (dto.puerto_http != null) params.puerto_http = dto.puerto_http;
    if (dto.puerto_rtsp != null) params.puerto_rtsp = dto.puerto_rtsp;
    if (dto.usuario != null) params.usuario = dto.usuario;
    if (dto.password) params.secreto = this.secretos.cifrar(dto.password);
    if (dto.https != null) params.https = dto.https;
    if (dto.en_prueba != null) params.en_prueba = dto.en_prueba;

    return this.prisma.dispositivo.update({
      where: { id },
      data: {
        modelo: dto.modelo ?? disp.modelo,
        nro_abonado: dto.nro_abonado ?? disp.nro_abonado,
        params,
        updated_at: new Date(),
      },
    });
  }

  async eliminarDispositivo(tenantId: string, id: string) {
    await this.cargarDispositivo(tenantId, id);
    await this.prisma.dispositivo.update({
      where: { id },
      data: { deleted_at: new Date(), estado: 'DESHABILITADO' },
    });
    return { ok: true };
  }

  /** Descubre los canales por ISAPI y los sincroniza en dispositivo_canales. */
  async descubrirCanales(tenantId: string, id: string) {
    const disp = await this.cargarDispositivo(tenantId, id);
    const canales = await this.hik.clientePara(disp).descubrirCanales();
    for (const c of canales) {
      await this.prisma.dispositivoCanal.upsert({
        where: {
          tenant_id_dispositivo_id_numero_canal: {
            tenant_id: tenantId,
            dispositivo_id: id,
            numero_canal: c.numero,
          },
        },
        create: {
          tenant_id: tenantId,
          dispositivo_id: id,
          numero_canal: c.numero,
          nombre: c.nombre,
          tiene_ptz: !!c.tienePtz,
        },
        update: { tiene_ptz: !!c.tienePtz },
      });
    }
    return this.getCanales(tenantId, id);
  }

  async getCanales(tenantId: string, dispositivoId: string) {
    return this.prisma.dispositivoCanal.findMany({
      where: { tenant_id: tenantId, dispositivo_id: dispositivoId },
      orderBy: { numero_canal: 'asc' },
    });
  }

  async actualizarCanal(
    tenantId: string,
    canalId: string,
    dto: ActualizarCanalDto,
  ) {
    const canal = await this.prisma.dispositivoCanal.findFirst({
      where: { id: canalId, tenant_id: tenantId },
    });
    if (!canal) throw new NotFoundException('Canal inexistente');
    return this.prisma.dispositivoCanal.update({
      where: { id: canalId },
      data: {
        nombre: dto.nombre ?? canal.nombre,
        rtsp_path: dto.rtsp_path ?? canal.rtsp_path,
        tiene_ptz: dto.tiene_ptz ?? canal.tiene_ptz,
        habilitado: dto.habilitado ?? canal.habilitado,
      },
    });
  }

  // === F4 · Mapeo zona → canal ==============================================

  async getZonasDeDispositivo(tenantId: string, dispositivoId: string) {
    return this.prisma.zona.findMany({
      where: { tenant_id: tenantId, dispositivo_id: dispositivoId },
      include: {
        canal: { select: { id: true, numero_canal: true, nombre: true } },
      },
      orderBy: { numero_zona: 'asc' },
    });
  }

  async mapearZonaCanal(
    tenantId: string,
    zonaId: string,
    canalId: string | null,
  ) {
    const zona = await this.prisma.zona.findFirst({
      where: { id: zonaId, tenant_id: tenantId },
    });
    if (!zona) throw new NotFoundException('Zona inexistente');
    if (canalId) {
      const canal = await this.prisma.dispositivoCanal.findFirst({
        where: { id: canalId, tenant_id: tenantId },
      });
      if (!canal) throw new BadRequestException('Canal inexistente');
    }
    return this.prisma.zona.update({
      where: { id: zonaId },
      data: { canal_id: canalId },
    });
  }

  private async cargarDispositivo(tenantId: string, id: string) {
    const disp = await this.prisma.dispositivo.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!disp) throw new NotFoundException('Dispositivo inexistente');
    return disp;
  }
}

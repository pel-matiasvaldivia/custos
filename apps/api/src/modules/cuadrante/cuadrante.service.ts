import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generarTurnosDesdeEsquema, EsquemaDef } from './cuadrante.domain';
import {
  conciliarHH,
  TurnoConciliable,
  ModoFacturacion,
} from './conciliacion.domain';
import { validarTurno, ReglasValidacion } from './validacion.domain';
import { detectarCobertura, VentanaCobertura } from './cobertura.domain';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { CreateEsquemaTurnoDto } from './dto/create-esquema-turno.dto';
import { CreateAsignacionEsquemaDto } from './dto/create-asignacion-esquema.dto';
import { UpsertPuestoCoberturaDto } from './dto/upsert-puesto-cobertura.dto';
import {
  estaDisponibleParaAsignacion,
  VIGILADOR_ESTADO_LABEL,
} from '../../vigilante/vigilador-estado';

function horaNum(hhmm: string): number {
  return parseInt(hhmm.split(':')[0], 10);
}

@Injectable()
export class CuadranteService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  /**
   * Genera y persiste los turnos planificados de una asignación de esquema en
   * el rango [desde, hasta]. Aplica validación dura (§7): un turno con errores
   * NO se persiste. Idempotente (no recrea turnos existentes).
   */
  async generarCuadrante(
    tenantId: string,
    asignacionEsquemaId: string,
    desde: Date,
    hasta: Date,
  ) {
    const asig = await this.prisma.asignacionEsquema.findFirst({
      where: { id: asignacionEsquemaId, tenant_id: tenantId },
      include: { esquema: true },
    });
    if (!asig)
      throw new NotFoundException('Asignación de esquema no encontrada');

    const generados = generarTurnosDesdeEsquema({
      definicion: asig.esquema.definicion as unknown as EsquemaDef,
      diasCiclo: asig.esquema.dias_ciclo,
      posicionCiclo: asig.posicion_ciclo,
      fechaAncla: asig.fecha_ancla,
      desde,
      hasta,
    });

    // Reglas del tenant (con defaults del spec si no hay fila).
    const r = await this.prisma.reglaLaboral.findUnique({
      where: { tenant_id: tenantId },
    });
    const reglas: ReglasValidacion = {
      jornadaMaxSemanalH: r?.jornada_max_semanal_h ?? 48,
      descansoMinEntreJornadasH: r?.descanso_min_entre_jornadas_h ?? 12,
      maxDiasConsecutivos: r?.max_dias_consecutivos ?? 6,
    };

    // Contexto: turnos existentes del vigilador en una ventana amplia.
    const ventanaIni = new Date(desde.getTime() - 8 * 86_400_000);
    const ventanaFin = new Date(hasta.getTime() + 8 * 86_400_000);
    const existentes = await this.prisma.turnoPlanificado.findMany({
      where: {
        tenant_id: tenantId,
        vigilador_id: asig.vigilador_id,
        inicio_plan: { gte: ventanaIni, lte: ventanaFin },
      },
      select: { inicio_plan: true, fin_plan: true },
    });

    // Credenciales con vencimiento del vigilador (para chequeo por turno).
    const credenciales = await this.prisma.credencial.findMany({
      where: {
        tenant_id: tenantId,
        vigilador_id: asig.vigilador_id,
        vence_el: { not: null },
      },
      select: { vence_el: true, tipo: true },
    });

    const aceptados: { inicio_plan: Date; fin_plan: Date }[] = [...existentes];
    const creados: string[] = [];
    const rechazados: { inicio_plan: string; errores: string[] }[] = [];

    // Orden cronológico para que descanso/consecutivos se evalúen incrementalmente.
    const ordenados = [...generados].sort(
      (a, b) => a.inicio_plan.getTime() - b.inicio_plan.getTime(),
    );

    for (const t of ordenados) {
      const candidato = { inicio_plan: t.inicio_plan, fin_plan: t.fin_plan };
      const { errores } = validarTurno(candidato, aceptados, reglas);

      // CREDENCIAL_VENCIDA: alguna credencial vence antes del inicio del turno.
      const credVencida = credenciales.some(
        (c) => c.vence_el && c.vence_el < t.inicio_plan,
      );
      if (credVencida) errores.push('CREDENCIAL_VENCIDA');

      if (errores.length > 0) {
        rechazados.push({ inicio_plan: t.inicio_plan.toISOString(), errores });
        continue;
      }

      // Idempotencia: no recrear el mismo turno.
      const yaExiste = await this.prisma.turnoPlanificado.findFirst({
        where: {
          tenant_id: tenantId,
          puesto_id: asig.puesto_id,
          vigilador_id: asig.vigilador_id,
          inicio_plan: t.inicio_plan,
        },
        select: { id: true },
      });
      if (yaExiste) {
        aceptados.push(candidato);
        continue;
      }

      const turno = await this.prisma.turnoPlanificado.create({
        data: {
          tenant_id: tenantId,
          puesto_id: asig.puesto_id,
          vigilador_id: asig.vigilador_id,
          asignacion_esquema_id: asig.id,
          inicio_plan: t.inicio_plan,
          fin_plan: t.fin_plan,
          tipo_bloque: t.tipo_bloque,
          estado: 'PLANIFICADA',
        },
      });
      creados.push(turno.id);
      aceptados.push(candidato);
    }

    return {
      generados: generados.length,
      creados: creados.length,
      rechazados,
    };
  }

  /**
   * Cierra un período: valida que no queden turnos sin resolver, calcula la
   * conciliación HH por contrato y persiste el snapshot (congelada=true).
   * Vínculo turno→contrato: Contrato.objetivo_id = Puesto.objetivo_id.
   */
  async cerrarPeriodo(tenantId: string, periodoId: string, actorId?: string) {
    const periodo = await this.prisma.periodo.findFirst({
      where: { id: periodoId, tenant_id: tenantId },
    });
    if (!periodo) throw new NotFoundException('Período no encontrado');
    if (periodo.estado === 'CERRADO') {
      throw new BadRequestException('El período ya está cerrado');
    }

    const rango = {
      gte: new Date(periodo.desde),
      lte: new Date(periodo.hasta),
    };

    // Guard: turnos sin resolver (PENDIENTE/OBSERVADA) bloquean el cierre.
    const sinResolver = await this.prisma.turnoPlanificado.count({
      where: {
        tenant_id: tenantId,
        inicio_plan: rango,
        asistencia_estado: { in: ['PENDIENTE', 'OBSERVADA'] },
      },
    });
    if (sinResolver > 0) {
      throw new BadRequestException(
        `Hay ${sinResolver} turno(s) sin resolver; no se puede cerrar el período.`,
      );
    }

    // Reglas (ventana nocturna) del tenant.
    const reglas = await this.prisma.reglaLaboral.findUnique({
      where: { tenant_id: tenantId },
      select: {
        ventana_nocturna_inicio: true,
        ventana_nocturna_fin: true,
        jornada_max_semanal_h: true,
      },
    });
    const nocheInicio = reglas ? horaNum(reglas.ventana_nocturna_inicio) : 21;
    const nocheFin = reglas ? horaNum(reglas.ventana_nocturna_fin) : 6;

    // Feriados del período → set de 'YYYY-MM-DD'.
    const feriados = await this.prisma.feriado.findMany({
      where: { tenant_id: tenantId, fecha: rango },
      select: { fecha: true },
    });
    const feriadoSet = new Set(
      feriados.map((f) => f.fecha.toISOString().slice(0, 10)),
    );

    // Contratos del tenant con su modo de facturación.
    const contratos = await this.prisma.contrato.findMany({
      where: { tenant_id: tenantId, objetivo_id: { not: null } },
      select: { id: true, objetivo_id: true },
    });
    const facturaciones = await this.prisma.contratoFacturacion.findMany({
      where: { tenant_id: tenantId },
      select: { contrato_id: true, modo: true, penaliza_hueco: true },
    });
    const factByContrato = new Map(
      facturaciones.map((f) => [f.contrato_id, f]),
    );

    const snapshots = [];
    for (const contrato of contratos) {
      const puestos = await this.prisma.puesto.findMany({
        where: { tenant_id: tenantId, objetivo_id: contrato.objetivo_id, deleted_at: null },
        select: { id: true },
      });
      if (puestos.length === 0) continue;

      const turnos = await this.prisma.turnoPlanificado.findMany({
        where: {
          tenant_id: tenantId,
          puesto_id: { in: puestos.map((p) => p.id) },
          inicio_plan: rango,
        },
        select: {
          inicio_plan: true,
          fin_plan: true,
          inicio_real: true,
          fin_real: true,
          asistencia_estado: true,
          vigilador_id: true,
        },
      });
      if (turnos.length === 0) continue;

      const conciliables: TurnoConciliable[] = turnos.map((t) => ({
        inicioPlan: t.inicio_plan,
        finPlan: t.fin_plan,
        inicioReal: t.inicio_real,
        finReal: t.fin_real,
        esCubierto:
          t.asistencia_estado === 'OK' && !!t.inicio_real && !!t.fin_real,
        esFeriado: feriadoSet.has(t.inicio_plan.toISOString().slice(0, 10)),
        vigiladorId: t.vigilador_id,
      }));

      const fact = factByContrato.get(contrato.id);
      const modo: ModoFacturacion =
        (fact?.modo as ModoFacturacion) ?? 'POR_PLANIFICADO';
      const topeSemanalH = reglas?.jornada_max_semanal_h ?? 48;

      const hh = conciliarHH(conciliables, {
        modo,
        penalizaHueco: fact?.penaliza_hueco ?? false,
        nocheInicioHora: nocheInicio,
        nocheFinHora: nocheFin,
        topeSemanalH,
      });

      snapshots.push(
        await this.prisma.conciliacionHH.create({
          data: {
            tenant_id: tenantId,
            periodo_id: periodoId,
            contrato_id: contrato.id,
            hh_planificadas: hh.hh_planificadas,
            hh_reales: hh.hh_reales,
            hh_facturables: hh.hh_facturables,
            hh_normales: hh.hh_normales,
            hh_nocturnas: hh.hh_nocturnas,
            hh_extra: hh.hh_extra,
            hh_feriado: hh.hh_feriado,
            congelada: true,
          },
        }),
      );
    }

    await this.prisma.periodo.update({
      where: { id: periodoId },
      data: { estado: 'CERRADO' },
    });

    // Acción sensible: cierre de período (spec §11 → auditoría).
    if (actorId) {
      await this.auditoria.registrar({
        tenantId,
        actorId,
        entidad: 'periodos',
        entidadId: periodoId,
        accion: 'CERRAR',
        despues: { estado: 'CERRADO', conciliaciones: snapshots.length },
      });
    }

    return { periodo: periodoId, conciliaciones: snapshots.length };
  }

  /**
   * Detección de cobertura de un puesto en [desde, hasta]: compara los turnos
   * planificados contra la ventana y dotación requerida de puesto_cobertura,
   * reportando huecos y sobre-dotación (spec §6).
   */
  async detectarCoberturaPuesto(
    tenantId: string,
    puestoId: string,
    desde: Date,
    hasta: Date,
  ) {
    const cobertura = await this.prisma.puestoCobertura.findFirst({
      where: { tenant_id: tenantId, puesto_id: puestoId },
    });
    if (!cobertura) {
      throw new NotFoundException(
        'El puesto no tiene cobertura configurada (puesto_cobertura)',
      );
    }

    const turnos = await this.prisma.turnoPlanificado.findMany({
      where: {
        tenant_id: tenantId,
        puesto_id: puestoId,
        inicio_plan: { lt: hasta },
        fin_plan: { gt: desde },
      },
      select: { inicio_plan: true, fin_plan: true },
    });

    const resultado = detectarCobertura(
      turnos.map((t) => ({ inicio: t.inicio_plan, fin: t.fin_plan })),
      cobertura.dotacion_requerida,
      cobertura.ventana as unknown as VentanaCobertura,
      desde,
      hasta,
    );

    return {
      puestoId,
      dotacionRequerida: cobertura.dotacion_requerida,
      huecos: resultado.huecos,
      sobreDotacion: resultado.sobre,
    };
  }

  // ─── Esquemas de turno ───

  async crearEsquema(tenantId: string, dto: CreateEsquemaTurnoDto) {
    return this.prisma.esquemaTurno.create({
      data: {
        tenant_id: tenantId,
        nombre: dto.nombre,
        dias_ciclo: dto.dias_ciclo,
        definicion: { dias_ciclo: dto.dias_ciclo, dias: dto.dias } as any,
      },
    });
  }

  async listarEsquemas(tenantId: string) {
    return this.prisma.esquemaTurno.findMany({
      where: { tenant_id: tenantId, deleted_at: null },
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerEsquema(tenantId: string, id: string) {
    const esquema = await this.prisma.esquemaTurno.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!esquema) throw new NotFoundException('Esquema de turno no encontrado');
    return esquema;
  }

  async eliminarEsquema(tenantId: string, id: string) {
    await this.obtenerEsquema(tenantId, id);
    const enUso = await this.prisma.asignacionEsquema.count({
      where: { tenant_id: tenantId, esquema_id: id, vigente_hasta: null },
    });
    if (enUso > 0) {
      throw new BadRequestException(
        'No se puede eliminar: hay asignaciones activas usando este esquema.',
      );
    }
    return this.prisma.esquemaTurno.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  // ─── Asignaciones de esquema (afectación vigilador → puesto) ───

  async crearAsignacionEsquema(
    tenantId: string,
    dto: CreateAsignacionEsquemaDto,
  ) {
    const [puesto, vigilador, esquema] = await Promise.all([
      this.prisma.puesto.findFirst({
        where: { id: dto.puesto_id, tenant_id: tenantId, deleted_at: null },
      }),
      this.prisma.vigilador.findFirst({
        where: { id: dto.vigilador_id, tenant_id: tenantId },
      }),
      this.prisma.esquemaTurno.findFirst({
        where: { id: dto.esquema_id, tenant_id: tenantId, deleted_at: null },
      }),
    ]);
    if (!puesto) throw new NotFoundException('Puesto no encontrado');
    if (!vigilador) throw new NotFoundException('Vigilador no encontrado');
    if (!esquema) throw new NotFoundException('Esquema de turno no encontrado');

    // Solo el personal ACTIVO puede afectarse a un puesto. Si está de parte de
    // enfermo, vacaciones, licencia, suspendido o dado de baja, no está disponible.
    if (!estaDisponibleParaAsignacion(vigilador.estado)) {
      const label = VIGILADOR_ESTADO_LABEL[vigilador.estado] ?? vigilador.estado;
      throw new BadRequestException(
        `El vigilador no está disponible para asignación (estado: ${label}). Solo se puede afectar personal Activo.`,
      );
    }

    const asignacion = await this.prisma.asignacionEsquema.create({
      data: {
        tenant_id: tenantId,
        puesto_id: dto.puesto_id,
        vigilador_id: dto.vigilador_id,
        esquema_id: dto.esquema_id,
        posicion_ciclo: dto.posicion_ciclo ?? 0,
        fecha_ancla: new Date(dto.fecha_ancla),
        vigente_desde: new Date(dto.vigente_desde),
      },
    });

    const desde = dto.generar_desde ? new Date(dto.generar_desde) : new Date();
    const hasta = dto.generar_hasta
      ? new Date(dto.generar_hasta)
      : new Date(desde.getTime() + 35 * 86_400_000);

    const generacion = await this.generarCuadrante(
      tenantId,
      asignacion.id,
      desde,
      hasta,
    );

    return { asignacion, generacion };
  }

  async listarAsignacionesPorObjetivo(tenantId: string, objetivoId: string) {
    const puestos = await this.prisma.puesto.findMany({
      where: { tenant_id: tenantId, objetivo_id: objetivoId, deleted_at: null },
      select: { id: true, nombre: true },
    });
    if (puestos.length === 0) return [];

    const asignaciones = await this.prisma.asignacionEsquema.findMany({
      where: {
        tenant_id: tenantId,
        puesto_id: { in: puestos.map((p) => p.id) },
        vigente_hasta: null,
      },
      include: { esquema: true },
    });
    if (asignaciones.length === 0) return [];

    const vigiladores = await this.prisma.vigilador.findMany({
      where: {
        tenant_id: tenantId,
        id: { in: asignaciones.map((a) => a.vigilador_id) },
      },
      select: { id: true, nombre: true, apellido: true, legajo_nro: true },
    });
    const vigiladorPorId = new Map(vigiladores.map((v) => [v.id, v]));
    const puestoPorId = new Map(puestos.map((p) => [p.id, p]));

    return asignaciones.map((a) => ({
      id: a.id,
      puestoId: a.puesto_id,
      puestoNombre: puestoPorId.get(a.puesto_id)?.nombre ?? null,
      vigiladorId: a.vigilador_id,
      vigilador: vigiladorPorId.get(a.vigilador_id) ?? null,
      esquemaId: a.esquema_id,
      esquemaNombre: a.esquema.nombre,
      posicionCiclo: a.posicion_ciclo,
      fechaAncla: a.fecha_ancla,
      vigenteDesde: a.vigente_desde,
    }));
  }

  async finalizarAsignacionEsquema(
    tenantId: string,
    id: string,
    vigenteHasta: Date,
  ) {
    const asig = await this.prisma.asignacionEsquema.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!asig)
      throw new NotFoundException('Asignación de esquema no encontrada');

    const now = new Date();
    const [asignacionActualizada, { count: turnosBorrados }] =
      await this.prisma.$transaction([
        this.prisma.asignacionEsquema.update({
          where: { id },
          data: { vigente_hasta: vigenteHasta },
        }),
        // Borrar turnos futuros PLANIFICADOS de esta asignación. Los que ya
        // ocurrieron (inicio_plan <= now) se conservan para historial/liquidaciones.
        this.prisma.turnoPlanificado.deleteMany({
          where: {
            tenant_id: tenantId,
            asignacion_esquema_id: id,
            inicio_plan: { gt: now },
            estado: 'PLANIFICADA',
          },
        }),
      ]);

    return { ...asignacionActualizada, turnosBorrados };
  }

  // ─── Cobertura por puesto ───

  async upsertCobertura(
    tenantId: string,
    puestoId: string,
    dto: UpsertPuestoCoberturaDto,
  ) {
    const puesto = await this.prisma.puesto.findFirst({
      where: { id: puestoId, tenant_id: tenantId, deleted_at: null },
    });
    if (!puesto) throw new NotFoundException('Puesto no encontrado');

    const regla = await this.prisma.reglaLaboral.findUnique({
      where: { tenant_id: tenantId },
    });
    const jornadaMaxSemanalH = regla?.jornada_max_semanal_h ?? 48;

    const sugerido = Math.ceil(
      (dto.ventana.horas_dia * dto.ventana.dias.length) / jornadaMaxSemanalH,
    );
    const dotacionRequerida = dto.dotacion_requerida ?? sugerido;

    return this.prisma.puestoCobertura.upsert({
      where: {
        tenant_id_puesto_id: { tenant_id: tenantId, puesto_id: puestoId },
      },
      create: {
        tenant_id: tenantId,
        puesto_id: puestoId,
        dotacion_requerida: dotacionRequerida,
        ventana: dto.ventana as any,
      },
      update: {
        dotacion_requerida: dotacionRequerida,
        ventana: dto.ventana as any,
      },
    });
  }

  async obtenerCobertura(tenantId: string, puestoId: string) {
    return this.prisma.puestoCobertura.findFirst({
      where: { tenant_id: tenantId, puesto_id: puestoId },
    });
  }

  // ─── Vista agregada de cuadrante por objetivo ───

  async cuadranteDeObjetivo(
    tenantId: string,
    objetivoId: string,
    desde: Date,
    hasta: Date,
  ) {
    const puestos = await this.prisma.puesto.findMany({
      where: { tenant_id: tenantId, objetivo_id: objetivoId, deleted_at: null },
      select: { id: true, nombre: true },
    });
    if (puestos.length === 0) return [];

    const puestoIds = puestos.map((p) => p.id);

    const [turnos, coberturas] = await Promise.all([
      this.prisma.turnoPlanificado.findMany({
        where: {
          tenant_id: tenantId,
          puesto_id: { in: puestoIds },
          inicio_plan: { lt: hasta },
          fin_plan: { gt: desde },
        },
      }),
      this.prisma.puestoCobertura.findMany({
        where: { tenant_id: tenantId, puesto_id: { in: puestoIds } },
      }),
    ]);

    const vigiladorIds = Array.from(new Set(turnos.map((t) => t.vigilador_id)));
    const vigiladores = vigiladorIds.length
      ? await this.prisma.vigilador.findMany({
          where: { tenant_id: tenantId, id: { in: vigiladorIds } },
          select: { id: true, nombre: true, apellido: true },
        })
      : [];
    const vigiladorPorId = new Map(vigiladores.map((v) => [v.id, v]));
    const coberturaPorPuesto = new Map(coberturas.map((c) => [c.puesto_id, c]));

    return puestos.map((puesto) => {
      const turnosPuesto = turnos
        .filter((t) => t.puesto_id === puesto.id)
        .map((t) => ({
          id: t.id,
          inicioPlan: t.inicio_plan,
          finPlan: t.fin_plan,
          tipoBloque: t.tipo_bloque,
          estado: t.estado,
          motivo: t.motivo,
          vigiladorId: t.vigilador_id,
          vigilador: vigiladorPorId.get(t.vigilador_id) ?? null,
        }));

      const cobertura = coberturaPorPuesto.get(puesto.id);
      let resultadoCobertura: ReturnType<typeof detectarCobertura> | null =
        null;
      if (cobertura) {
        resultadoCobertura = detectarCobertura(
          turnos
            .filter((t) => t.puesto_id === puesto.id)
            .map((t) => ({ inicio: t.inicio_plan, fin: t.fin_plan })),
          cobertura.dotacion_requerida,
          cobertura.ventana as unknown as VentanaCobertura,
          desde,
          hasta,
        );
      }

      return {
        puestoId: puesto.id,
        puestoNombre: puesto.nombre,
        turnos: turnosPuesto,
        dotacionRequerida: cobertura?.dotacion_requerida ?? null,
        cobertura: resultadoCobertura
          ? {
              huecos: resultadoCobertura.huecos,
              sobreDotacion: resultadoCobertura.sobre,
            }
          : null,
      };
    });
  }
}

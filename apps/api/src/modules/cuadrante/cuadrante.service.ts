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
    if (!asig) throw new NotFoundException('Asignación de esquema no encontrada');

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
    const factByContrato = new Map(facturaciones.map((f) => [f.contrato_id, f]));

    const snapshots = [];
    for (const contrato of contratos) {
      const puestos = await this.prisma.puesto.findMany({
        where: { tenant_id: tenantId, objetivo_id: contrato.objetivo_id },
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
        esCubierto: t.asistencia_estado === 'OK' && !!t.inicio_real && !!t.fin_real,
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
}

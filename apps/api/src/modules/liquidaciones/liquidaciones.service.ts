import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Liquidaciones — calcula las horas exactas a pagar por vigilador en un período,
 * a partir de la asistencia real registrada en los turnos planificados
 * (inicio_real / fin_real / asistencia_estado) y de las novedades del período
 * (ausencias, llegadas tarde, suspensiones y adelantos de sueldo).
 *
 * El modo de cálculo lo define el tenant (elegido en el onboarding):
 *   - VALOR_HORA_MANUAL: valor hora por vigilador (o el default del período).
 *   - BASICO_507:        idem, tomando el valor hora de la categoría (a cargar).
 *   - SOLO_HORAS:        sólo computa horas, sin montos.
 *
 * Los adelantos de sueldo se descuentan del neto tomándolos del ledger `adelantos`
 * (una cuota por período; ante baja del vigilador, el saldo completo).
 */
@Injectable()
export class LiquidacionesService {
  constructor(private prisma: PrismaService) {}

  private horasEntre(a: Date, b: Date): number {
    return Math.max(0, (b.getTime() - a.getTime()) / 3_600_000);
  }

  /** Horas del intervalo [ini,fin] que caen dentro de la ventana nocturna. */
  private horasNocturnas(ini: Date, fin: Date, desdeH: number, hastaH: number): number {
    let noct = 0;
    const cursor = new Date(ini);
    while (cursor < fin) {
      const next = new Date(cursor.getTime() + 3_600_000);
      const tramoFin = next < fin ? next : fin;
      const h = cursor.getHours();
      const esNocturna = desdeH > hastaH ? h >= desdeH || h < hastaH : h >= desdeH && h < hastaH;
      if (esNocturna) noct += this.horasEntre(cursor, tramoFin);
      cursor.setTime(next.getTime());
    }
    return noct;
  }

  private parseFechas(desdeStr: string, hastaStr: string) {
    const desde = new Date(desdeStr);
    const hasta = new Date(hastaStr);
    if (isNaN(desde.getTime()) || isNaN(hasta.getTime())) {
      throw new BadRequestException('Rango de fechas inválido.');
    }
    hasta.setHours(23, 59, 59, 999);
    return { desde, hasta };
  }

  /**
   * Cómputo (preview, no persiste). Devuelve horas + montos por vigilador.
   * El descuento de adelanto es proyectado (una cuota) sin mutar el ledger.
   */
  async computar(
    tenantId: string,
    desdeStr: string,
    hastaStr: string,
    valorHoraDefault = 0,
  ) {
    const { desde, hasta } = this.parseFechas(desdeStr, hastaStr);

    const [tenant, regla] = await Promise.all([
      this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { modo_liquidacion: true },
      }),
      this.prisma.reglaLaboral.findUnique({
        where: { tenant_id: tenantId },
        select: {
          ventana_nocturna_inicio: true,
          ventana_nocturna_fin: true,
          recargo_nocturno_pct: true,
          recargo_extra_pct: true,
        },
      }),
    ]);

    const modo = tenant?.modo_liquidacion ?? 'VALOR_HORA_MANUAL';
    const conMontos = modo !== 'SOLO_HORAS';
    const noctIni = parseInt((regla?.ventana_nocturna_inicio ?? '21:00').split(':')[0], 10);
    const noctFin = parseInt((regla?.ventana_nocturna_fin ?? '06:00').split(':')[0], 10);
    const recNoct = (regla?.recargo_nocturno_pct ?? 20) / 100;
    const recExtra = (regla?.recargo_extra_pct ?? 50) / 100;

    const [vigiladores, turnos, adelantos] = await Promise.all([
      this.prisma.vigilador.findMany({
        where: { tenant_id: tenantId, estado: 'ACTIVO', deleted_at: null },
        select: {
          id: true, legajo_nro: true, nombre: true, apellido: true,
          valor_hora: true, estado: true,
        },
        orderBy: { apellido: 'asc' },
      }),
      this.prisma.turnoPlanificado.findMany({
        where: { tenant_id: tenantId, inicio_plan: { gte: desde, lte: hasta } },
        select: {
          vigilador_id: true, inicio_plan: true, fin_plan: true,
          inicio_real: true, fin_real: true, asistencia_estado: true, estado: true,
        },
      }),
      this.prisma.adelanto.findMany({
        where: { tenant_id: tenantId, estado: 'VIGENTE' },
        select: { vigilador_id: true, monto: true, cuotas: true, saldo: true },
      }),
    ]);

    const acc = this.agregarTurnos(vigiladores.map((v) => v.id), turnos, noctIni, noctFin);

    // Suspensiones desde novedades
    const susp = await this.prisma.novedad.findMany({
      where: {
        tenant_id: tenantId,
        created_at: { gte: desde, lte: hasta },
        tipo: 'SUSPENSION',
      },
      select: { vigilador_id: true },
    });
    for (const s of susp) {
      if (s.vigilador_id && acc[s.vigilador_id]) acc[s.vigilador_id].suspension_dias += 1;
    }

    // Adelanto proyectado por vigilador (una cuota)
    const cuotaPorVig: Record<string, number> = {};
    for (const a of adelantos) {
      if (!a.vigilador_id) continue;
      const cuota = Math.min(Number(a.saldo), Number(a.monto) / (a.cuotas || 1));
      cuotaPorVig[a.vigilador_id] = (cuotaPorVig[a.vigilador_id] ?? 0) + cuota;
    }

    const round = (n: number) => Math.round(n * 100) / 100;
    return {
      modo,
      con_montos: conMontos,
      items: vigiladores.map((v) => {
        const a = acc[v.id];
        const vh = conMontos ? Number(v.valor_hora ?? 0) || valorHoraDefault : 0;
        const bruto =
          vh * a.hh_trabajadas + vh * recNoct * a.hh_nocturnas + vh * recExtra * a.hh_extra;
        const descSuspension = vh * a.suspension_dias * 8;
        const adelanto = round(cuotaPorVig[v.id] ?? 0);
        const neto = Math.max(0, bruto - descSuspension - adelanto);
        return {
          vigilador_id: v.id,
          legajo: v.legajo_nro,
          nombre: v.nombre,
          apellido: v.apellido,
          valor_hora: vh,
          turnos: a.turnos_count,
          hh_planificadas: round(a.hh_planificadas),
          hh_trabajadas: round(a.hh_trabajadas),
          hh_ausentes: round(a.hh_ausentes),
          hh_nocturnas: round(a.hh_nocturnas),
          hh_extra: round(a.hh_extra),
          llegadas_tarde: a.llegadas_tarde_count,
          llegadas_tarde_min: a.llegadas_tarde_min,
          suspension_dias: a.suspension_dias,
          bruto: round(bruto),
          descuentos: round(descSuspension),
          adelanto_desc: adelanto,
          neto: round(neto),
        };
      }),
    };
  }

  /** Cierra el período: persiste la liquidación + items y descuenta los adelantos. */
  async cerrar(
    tenantId: string,
    dto: { desde: string; hasta: string; modo?: string; valor_hora_default?: number },
  ) {
    const preview = await this.computar(
      tenantId,
      dto.desde,
      dto.hasta,
      dto.valor_hora_default ?? 0,
    );
    const { desde, hasta } = this.parseFechas(dto.desde, dto.hasta);

    return this.prisma.$transaction(async (tx) => {
      const cabecera = await tx.liquidacion.create({
        data: {
          tenant_id: tenantId,
          periodo_desde: desde,
          periodo_hasta: hasta,
          modo: dto.modo ?? preview.modo,
          estado: 'CERRADA',
          total_neto: preview.items.reduce((s, i) => s + i.neto, 0),
        },
      });

      for (const it of preview.items) {
        await tx.liquidacionItem.create({
          data: {
            tenant_id: tenantId,
            liquidacion_id: cabecera.id,
            vigilador_id: it.vigilador_id,
            hh_trabajadas: it.hh_trabajadas,
            hh_nocturnas: it.hh_nocturnas,
            hh_extra: it.hh_extra,
            hh_ausentes: it.hh_ausentes,
            llegadas_tarde: it.llegadas_tarde,
            suspension_dias: it.suspension_dias,
            bruto: it.bruto,
            descuentos: it.descuentos,
            adelanto_desc: it.adelanto_desc,
            neto: it.neto,
          },
        });
      }

      // Amortiza los adelantos vigentes: una cuota por período (o el saldo total
      // si el vigilador ya no está activo — baja → descuento final).
      const adelantos = await tx.adelanto.findMany({
        where: { tenant_id: tenantId, estado: 'VIGENTE' },
        include: { vigilador: { select: { estado: true } } },
      });
      for (const a of adelantos) {
        const baja = a.vigilador?.estado !== 'ACTIVO';
        const cuota = baja
          ? Number(a.saldo)
          : Math.min(Number(a.saldo), Number(a.monto) / (a.cuotas || 1));
        const nuevoSaldo = Math.max(0, Number(a.saldo) - cuota);
        const cuotasPagas = Math.min(a.cuotas, a.cuotas_pagas + 1);
        await tx.adelanto.update({
          where: { id: a.id },
          data: {
            saldo: nuevoSaldo,
            cuotas_pagas: cuotasPagas,
            estado: nuevoSaldo <= 0 || baja ? 'SALDADO' : 'VIGENTE',
          },
        });
      }

      return cabecera;
    });
  }

  /** Modo de liquidación configurado por el tenant (elegible en el onboarding). */
  async getConfig(tenantId: string) {
    const t = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { modo_liquidacion: true },
    });
    return { modo: t?.modo_liquidacion ?? 'VALOR_HORA_MANUAL' };
  }

  async setModo(tenantId: string, modo: string) {
    const permitidos = ['VALOR_HORA_MANUAL', 'BASICO_507', 'SOLO_HORAS'];
    if (!permitidos.includes(modo)) {
      throw new BadRequestException('Modo de liquidación inválido.');
    }
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { modo_liquidacion: modo },
    });
    return { modo };
  }

  /** Historial de liquidaciones cerradas. */
  async historial(tenantId: string) {
    return this.prisma.liquidacion.findMany({
      where: { tenant_id: tenantId },
      orderBy: { periodo_desde: 'desc' },
    });
  }

  async obtener(tenantId: string, id: string) {
    const liq = await this.prisma.liquidacion.findFirst({
      where: { id, tenant_id: tenantId },
      include: {
        items: { include: { vigilador: { select: { legajo_nro: true, nombre: true, apellido: true } } } },
      },
    });
    if (!liq) throw new NotFoundException('Liquidación no encontrada.');
    return liq;
  }

  // ── helpers ──
  private agregarTurnos(
    vigiladorIds: string[],
    turnos: Array<{
      vigilador_id: string;
      inicio_plan: Date;
      fin_plan: Date;
      inicio_real: Date | null;
      fin_real: Date | null;
      asistencia_estado: string;
      estado: string;
    }>,
    noctIni: number,
    noctFin: number,
  ) {
    type Acc = {
      hh_planificadas: number; hh_trabajadas: number; hh_ausentes: number;
      hh_nocturnas: number; hh_extra: number; llegadas_tarde_count: number;
      llegadas_tarde_min: number; suspension_dias: number; turnos_count: number;
    };
    const base = (): Acc => ({
      hh_planificadas: 0, hh_trabajadas: 0, hh_ausentes: 0, hh_nocturnas: 0,
      hh_extra: 0, llegadas_tarde_count: 0, llegadas_tarde_min: 0,
      suspension_dias: 0, turnos_count: 0,
    });
    const acc: Record<string, Acc> = {};
    for (const id of vigiladorIds) acc[id] = base();

    for (const t of turnos) {
      const a = acc[t.vigilador_id];
      if (!a) continue;
      a.turnos_count += 1;
      const hhPlan = this.horasEntre(t.inicio_plan, t.fin_plan);
      a.hh_planificadas += hhPlan;

      const ausente = t.asistencia_estado === 'AUSENTE' || t.estado === 'AUSENTE';
      if (ausente || !t.inicio_real || !t.fin_real) {
        if (ausente) a.hh_ausentes += hhPlan;
        continue;
      }

      const hhReal = this.horasEntre(t.inicio_real, t.fin_real);
      a.hh_trabajadas += hhReal;
      a.hh_nocturnas += this.horasNocturnas(t.inicio_real, t.fin_real, noctIni, noctFin);
      if (hhReal > hhPlan + 0.02) a.hh_extra += hhReal - hhPlan;

      const tardeMin = (t.inicio_real.getTime() - t.inicio_plan.getTime()) / 60_000;
      if (tardeMin > 5) {
        a.llegadas_tarde_count += 1;
        a.llegadas_tarde_min += Math.round(tardeMin);
      }
    }
    return acc;
  }
}

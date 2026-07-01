import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Liquidaciones — calcula las horas exactas a pagar por vigilador en un período,
 * a partir de la asistencia real registrada en los turnos planificados
 * (inicio_real / fin_real / asistencia_estado) y de las novedades del período
 * (ausencias, llegadas tarde, suspensiones y adelantos de sueldo).
 *
 * El cómputo de horas no depende de ninguna tabla nueva: se apoya en los datos
 * que ya genera la operación. El valor monetario se aplica en el frontend según
 * el modo elegido (valor hora manual, básico 507 o sólo cómputo de horas).
 */
@Injectable()
export class LiquidacionesService {
  constructor(private prisma: PrismaService) {}

  private horasEntre(a: Date, b: Date): number {
    return Math.max(0, (b.getTime() - a.getTime()) / 3_600_000);
  }

  /** Horas del intervalo [ini,fin] que caen dentro de la ventana nocturna. */
  private horasNocturnas(ini: Date, fin: Date, desdeH: number, hastaH: number): number {
    // Ventana nocturna cruza medianoche (ej. 21 → 06). Recorremos hora a hora.
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

  async computar(tenantId: string, desdeStr: string, hastaStr: string) {
    const desde = new Date(desdeStr);
    const hasta = new Date(hastaStr);
    if (isNaN(desde.getTime()) || isNaN(hasta.getTime())) {
      throw new BadRequestException('Rango de fechas inválido.');
    }
    hasta.setHours(23, 59, 59, 999);

    const regla = await this.prisma.reglaLaboral.findUnique({
      where: { tenant_id: tenantId },
      select: { ventana_nocturna_inicio: true, ventana_nocturna_fin: true },
    });
    const noctIni = parseInt((regla?.ventana_nocturna_inicio ?? '21:00').split(':')[0], 10);
    const noctFin = parseInt((regla?.ventana_nocturna_fin ?? '06:00').split(':')[0], 10);

    const [vigiladores, turnos, novedades] = await Promise.all([
      this.prisma.vigilador.findMany({
        where: { tenant_id: tenantId, estado: 'ACTIVO', deleted_at: null },
        select: { id: true, legajo_nro: true, nombre: true, apellido: true },
        orderBy: { apellido: 'asc' },
      }),
      this.prisma.turnoPlanificado.findMany({
        where: { tenant_id: tenantId, inicio_plan: { gte: desde, lte: hasta } },
        select: {
          vigilador_id: true,
          inicio_plan: true,
          fin_plan: true,
          inicio_real: true,
          fin_real: true,
          asistencia_estado: true,
          estado: true,
        },
      }),
      this.prisma.novedad.findMany({
        where: { tenant_id: tenantId, created_at: { gte: desde, lte: hasta } },
        select: { vigilador_id: true, tipo: true, descripcion: true },
      }),
    ]);

    type Acc = {
      hh_planificadas: number;
      hh_trabajadas: number;
      hh_ausentes: number;
      hh_nocturnas: number;
      hh_extra: number;
      llegadas_tarde_count: number;
      llegadas_tarde_min: number;
      suspension_dias: number;
      adelanto_monto: number;
      turnos_count: number;
    };
    const base = (): Acc => ({
      hh_planificadas: 0, hh_trabajadas: 0, hh_ausentes: 0, hh_nocturnas: 0,
      hh_extra: 0, llegadas_tarde_count: 0, llegadas_tarde_min: 0,
      suspension_dias: 0, adelanto_monto: 0, turnos_count: 0,
    });
    const acc: Record<string, Acc> = {};
    for (const v of vigiladores) acc[v.id] = base();

    // Turnos → horas trabajadas, ausencias, extra, nocturnas, llegadas tarde
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

    // Novedades → suspensiones, adelantos, ausencias declaradas
    for (const n of novedades) {
      const a = n.vigilador_id ? acc[n.vigilador_id] : undefined;
      if (!a) continue;
      if (n.tipo === 'SUSPENSION') {
        a.suspension_dias += 1;
      } else if (n.tipo === 'ADELANTO_SUELDO') {
        // El modal codifica el monto como "[ADELANTO monto=NNN cuotas=N]".
        const m = /monto=(\d+(?:\.\d+)?)/.exec(n.descripcion || '');
        if (m) a.adelanto_monto += parseFloat(m[1]);
      }
    }

    const round = (n: number) => Math.round(n * 100) / 100;
    return vigiladores.map((v) => {
      const a = acc[v.id];
      const hhNetas = round(a.hh_trabajadas); // horas efectivamente trabajadas a pagar
      return {
        vigilador_id: v.id,
        legajo: v.legajo_nro,
        nombre: v.nombre,
        apellido: v.apellido,
        turnos: a.turnos_count,
        hh_planificadas: round(a.hh_planificadas),
        hh_trabajadas: hhNetas,
        hh_ausentes: round(a.hh_ausentes),
        hh_nocturnas: round(a.hh_nocturnas),
        hh_extra: round(a.hh_extra),
        llegadas_tarde: a.llegadas_tarde_count,
        llegadas_tarde_min: a.llegadas_tarde_min,
        suspension_dias: a.suspension_dias,
        adelanto_monto: round(a.adelanto_monto),
      };
    });
  }
}

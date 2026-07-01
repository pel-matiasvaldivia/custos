import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * KPIs del dashboard, calculados por tenant sobre datos reales:
 *  - vigiladores_activos: vigiladores en estado ACTIVO (no dados de baja).
 *  - credenciales_por_vencer: credenciales cuyo vencimiento cae dentro de los
 *    próximos 30 días (incluye ya vencidas, que son las más urgentes).
 *  - cobertura_hoy: % de turnos de hoy con asistencia registrada.
 */
@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async kpis(tenantId: string) {
    const en30 = new Date();
    en30.setDate(en30.getDate() + 30);
    const hoyIni = new Date();
    hoyIni.setHours(0, 0, 0, 0);
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const [vigiladoresActivos, credencialesPorVencer, turnosHoy] = await Promise.all([
      this.prisma.vigilador.count({
        where: { tenant_id: tenantId, estado: 'ACTIVO', deleted_at: null },
      }),
      this.prisma.credencial.count({
        where: { tenant_id: tenantId, vence_el: { lte: en30 } },
      }),
      this.prisma.turnoPlanificado.findMany({
        where: { tenant_id: tenantId, inicio_plan: { gte: hoyIni, lte: hoyFin } },
        select: { inicio_real: true, asistencia_estado: true },
      }),
    ]);

    const totalTurnos = turnosHoy.length;
    const cubiertos = turnosHoy.filter(
      (t) => t.inicio_real !== null || t.asistencia_estado === 'OK',
    ).length;
    const coberturaHoy = totalTurnos === 0 ? 100 : Math.round((cubiertos / totalTurnos) * 100);

    return {
      vigiladores_activos: vigiladoresActivos,
      credenciales_por_vencer: credencialesPorVencer,
      cobertura_hoy: coberturaHoy,
      turnos_hoy: totalTurnos,
      turnos_cubiertos_hoy: cubiertos,
    };
  }

  /**
   * Estado de los primeros pasos de configuración de un tenant nuevo, para la
   * guía de inicio del dashboard. Cada flag indica si ese paso ya está hecho.
   */
  async onboarding(tenantId: string) {
    const [
      personal,
      clientes,
      objetivos,
      puestos,
      esquemas,
      asignaciones,
      cotizaciones,
    ] = await Promise.all([
      this.prisma.vigilador.count({ where: { tenant_id: tenantId, deleted_at: null } }),
      this.prisma.cliente.count({ where: { tenant_id: tenantId, deleted_at: null } }),
      this.prisma.objetivo.count({ where: { tenant_id: tenantId } }),
      this.prisma.puesto.count({ where: { tenant_id: tenantId, deleted_at: null } }),
      this.prisma.esquemaTurno.count({ where: { tenant_id: tenantId, deleted_at: null } }),
      this.prisma.asignacionEsquema.count({ where: { tenant_id: tenantId, vigente_hasta: null } }),
      this.prisma.cotizacion.count({ where: { tenant_id: tenantId } }),
    ]);

    return {
      tiene_personal: personal > 0,
      tiene_clientes: clientes > 0,
      tiene_objetivos: objetivos > 0,
      tiene_puestos: puestos > 0,
      tiene_esquemas: esquemas > 0,
      tiene_cuadrante: asignaciones > 0,
      tiene_cotizaciones: cotizaciones > 0,
    };
  }
}

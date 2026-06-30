/**
 * M6 Flota — lógica de dominio PURA (sin DB).
 * Fuente: MODELOS_M2_A_M6_Y_PLATAFORMA.md L564-575.
 */

export interface VencimientoMovil {
  tipo: string; // VTV | SEGURO | PATENTE | HABILITACION_CAUDALES
  vence_el: Date;
}

const redondear2 = (n: number) => Math.round(n * 100) / 100;

/**
 * movilDisponibleYVigente(): false si el vehículo está EN_TALLER/BAJA, o tiene
 * VTV o SEGURO vencidos a la fecha. Bloqueo duro que M1 consume al asignar un
 * puesto que requiere móvil (criterio de aceptación #2).
 */
export function movilDisponibleYVigente(
  estado: string,
  vencimientos: VencimientoMovil[],
  hoy: Date = new Date(),
): boolean {
  if (estado === 'EN_TALLER' || estado === 'BAJA') return false;

  const criticos = new Set(['VTV', 'SEGURO']);
  for (const v of vencimientos) {
    if (criticos.has(v.tipo) && v.vence_el.getTime() < hoy.getTime()) {
      return false;
    }
  }
  return true;
}

/**
 * Rendimiento km/l = (km actual − km de la carga anterior) / litros.
 * Devuelve null si no hay carga anterior o litros inválidos.
 */
export function calcularRendimiento(
  kmActual: number,
  kmAnterior: number | null,
  litros: number,
): number | null {
  if (kmAnterior === null || litros <= 0 || kmActual <= kmAnterior) return null;
  return redondear2((kmActual - kmAnterior) / litros);
}

/**
 * Evalúa si un plan de mantenimiento disparó. KM: km_actual − ultimo_km >= cada_km.
 * TIEMPO: meses transcurridos desde ultima_fecha >= cada_meses.
 */
export function planMantenimientoDisparo(
  plan: {
    disparo: string;
    cada_km?: number | null;
    cada_meses?: number | null;
    ultimo_km?: number | null;
    ultima_fecha?: Date | null;
  },
  kmActual: number,
  hoy: Date = new Date(),
): boolean {
  if (plan.disparo === 'KM') {
    if (!plan.cada_km) return false;
    const base = plan.ultimo_km ?? 0;
    return kmActual - base >= plan.cada_km;
  }
  if (plan.disparo === 'TIEMPO') {
    if (!plan.cada_meses || !plan.ultima_fecha) return false;
    const meses =
      (hoy.getFullYear() - plan.ultima_fecha.getFullYear()) * 12 +
      (hoy.getMonth() - plan.ultima_fecha.getMonth());
    return meses >= plan.cada_meses;
  }
  return false;
}

/**
 * TCO del vehículo = depreciación + Σ OT + Σ combustible.
 */
export function calcularTCO(
  depreciacion: number,
  totalOrdenesTrabajo: number,
  totalCombustible: number,
): number {
  return redondear2(depreciacion + totalOrdenesTrabajo + totalCombustible);
}

/**
 * Prorratea el TCO a los contratos según la duración de cada asignación de móvil
 * dentro del período. Devuelve un mapa contrato_id → costo imputado.
 * Las asignaciones sin contrato_id se ignoran (no imputables).
 */
export function prorratearTCO(
  tco: number,
  asignaciones: { contrato_id: string | null; horas: number }[],
): Map<string, number> {
  const imputables = asignaciones.filter((a) => a.contrato_id && a.horas > 0);
  const totalHoras = imputables.reduce((acc, a) => acc + a.horas, 0);
  const out = new Map<string, number>();
  if (totalHoras <= 0) return out;

  for (const a of imputables) {
    const parte = redondear2((tco * a.horas) / totalHoras);
    out.set(
      a.contrato_id as string,
      (out.get(a.contrato_id as string) ?? 0) + parte,
    );
  }
  return out;
}

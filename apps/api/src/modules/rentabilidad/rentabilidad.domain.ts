/**
 * Motor de rentabilidad — lógica de dominio PURA (sin DB, sin NestJS).
 *
 * Fuente (specs):
 *  - PROMPT_ARQUITECTONICO_ERP_SEGURIDAD.md L173:
 *      costo_real = HH_real + compras_imputadas + flota_imputada
 *      compara costo_estimado (M3) vs costo_real; alerta si el margen se erosiona.
 *  - MODELO_MOTOR_DE_TIEMPO_Y_CUADRANTE.md L347:
 *      facturacion = hh_facturables × tarifa_hora (o abono_mensual)
 *      costo_laboral = Σ(hh_concepto × precio_concepto)
 *      margen = facturacion − costo_laboral − costos_imputados(compras + flota)
 *
 * Esta función NO inventa valores: recibe los componentes ya valorizados
 * y aplica la fórmula del spec de forma determinística.
 */

export interface EntradaRentabilidad {
  /** Facturación del período: hh_facturables × tarifa_hora, o abono_mensual. */
  facturacion: number;
  /** Costo laboral valorizado: Σ(hh_concepto × precio_concepto). */
  costoLaboral: number;
  /** Compras imputadas al contrato/objetivo (M5). */
  comprasImputadas: number;
  /** TCO de flota prorrateado al contrato (M6). */
  flotaImputada: number;
  /**
   * Umbral de erosión (fracción 0..1). Si el margen % cae por debajo,
   * se marca `erosionado`. Normalmente = tenant.margen_objetivo.
   */
  umbralErosion: number;
}

export interface ResultadoRentabilidad {
  facturacion: number;
  /** costo_laboral + compras + flota (spec L173). */
  costoReal: number;
  comprasImputadas: number;
  flotaImputada: number;
  costoLaboral: number;
  /** facturacion − costoReal. */
  margen: number;
  /** margen / facturacion (0 si no hay facturación). */
  margenPct: number;
  /** true si margenPct < umbralErosion. */
  erosionado: boolean;
}

const redondear2 = (n: number): number => Math.round(n * 100) / 100;

export function calcularRentabilidad(
  entrada: EntradaRentabilidad,
): ResultadoRentabilidad {
  const costoLaboral = entrada.costoLaboral ?? 0;
  const comprasImputadas = entrada.comprasImputadas ?? 0;
  const flotaImputada = entrada.flotaImputada ?? 0;
  const facturacion = entrada.facturacion ?? 0;

  const costoReal = costoLaboral + comprasImputadas + flotaImputada;
  const margen = facturacion - costoReal;
  const margenPct = facturacion > 0 ? margen / facturacion : 0;
  const erosionado = margenPct < (entrada.umbralErosion ?? 0);

  return {
    facturacion: redondear2(facturacion),
    costoReal: redondear2(costoReal),
    comprasImputadas: redondear2(comprasImputadas),
    flotaImputada: redondear2(flotaImputada),
    costoLaboral: redondear2(costoLaboral),
    margen: redondear2(margen),
    margenPct: Math.round(margenPct * 10000) / 10000,
    erosionado,
  };
}

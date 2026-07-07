/**
 * Helpers para armar registros de ancho fijo, el formato que exige ARCA para el
 * intercambio de archivos planos (altas de personal, Libro de Sueldos Digital).
 * En estos formatos cada campo ocupa una cantidad exacta de posiciones: los
 * alfanuméricos se rellenan con espacios a la derecha y los numéricos con ceros
 * a la izquierda. Un corrimiento de una sola posición invalida el archivo entero.
 */

// Marcas diacríticas combinantes (U+0300–U+036F): se eliminan tras NFD para
// dejar solo ASCII, porque los planos de ARCA no aceptan acentos ni ñ.
const DIACRITICOS = /[̀-ͯ]/g;

/** Alfanumérico: recorta a `len` y rellena con espacios a la derecha. */
export function alfa(valor: string | null | undefined, len: number): string {
  const s = (valor ?? '')
    .toString()
    .toUpperCase()
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .replace(/Ñ/g, 'N');
  return s.slice(0, len).padEnd(len, ' ');
}

/** Numérico: toma solo dígitos, recorta a `len` y rellena con ceros a la izquierda. */
export function num(
  valor: string | number | null | undefined,
  len: number,
): string {
  const s = (valor ?? '').toString().replace(/\D/g, '');
  return s.slice(-len).padStart(len, '0');
}

/**
 * Importe sin coma decimal: los planos de ARCA expresan los montos con los
 * decimales implícitos (2 posiciones). Ej: 1234.5 con len 15 → "000000000123450".
 */
export function importe(valor: number, len: number, decimales = 2): string {
  const centavos = Math.round(valor * 10 ** decimales);
  return centavos.toString().slice(-len).padStart(len, '0');
}

/** Fecha en formato AAAAMMDD (el más común en los planos de ARCA). */
export function fechaAmd(fecha: Date): string {
  const y = fecha.getUTCFullYear().toString().padStart(4, '0');
  const m = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = fecha.getUTCDate().toString().padStart(2, '0');
  return `${y}${m}${d}`;
}

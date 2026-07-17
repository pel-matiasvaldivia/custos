/**
 * Parser de CSV mínimo y robusto para los archivos que exporta la Simplificación
 * Registral / "Mis Empleados" / "Consulta Nómina" de ARCA. Soporta comillas
 * dobles, separador coma o punto y coma (autodetectado) y saltos CRLF/LF.
 * Evitamos una dependencia externa: el formato de entrada es acotado y conocido.
 *
 * Los exports reales de ARCA traen líneas de preámbulo antes de la cabecera
 * (CUIT, Período, Secuencia, Contribuyente); la cabecera real es la primera
 * fila que contiene una columna CUIL. `filasDesdeMatriz` centraliza esa
 * detección para que el mismo criterio sirva para CSV y para XLSX.
 */

export interface FilaCsv {
  [columna: string]: string;
}

/** Fila de datos con el número de línea/fila original del archivo (1-based). */
export interface FilaConLinea {
  linea: number;
  datos: FilaCsv;
}

const CLAVES_CUIL = ['cuil', 'cuil_cuit', 'cuil_del_trabajador'];
const CLAVES_NOMBRE = [
  'apellido',
  'nombre',
  'nombres',
  'apellido_y_nombre',
  'apellido_y_nombres',
  'trabajador',
];

const SEPARADORES: readonly (',' | ';' | '\t')[] = [',', ';', '\t'];

function detectarSeparador(cabecera: string): ',' | ';' | '\t' {
  const punto = (cabecera.match(/;/g) || []).length;
  const coma = (cabecera.match(/,/g) || []).length;
  const tab = (cabecera.match(/\t/g) || []).length;
  if (tab >= punto && tab >= coma) return '\t';
  return punto > coma ? ';' : ',';
}

function parsearLinea(linea: string, sep: string): string[] {
  const campos: string[] = [];
  let actual = '';
  let entreComillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (entreComillas) {
      if (c === '"') {
        if (linea[i + 1] === '"') {
          actual += '"';
          i++;
        } else {
          entreComillas = false;
        }
      } else {
        actual += c;
      }
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === sep) {
      campos.push(actual);
      actual = '';
    } else {
      actual += c;
    }
  }
  campos.push(actual);
  return campos.map((s) => s.trim());
}

/**
 * A partir de una matriz de celdas (de un CSV ya parseado o de una planilla
 * XLSX) ubica la fila de cabecera —la primera que tenga una columna CUIL o,
 * en su defecto, alguna de nombre/apellido— y devuelve las filas siguientes
 * como objetos indexados por nombre de columna normalizado. Las filas
 * completamente vacías se descartan.
 *
 * `lineas` permite conservar el número de línea/fila original del archivo
 * (para mensajes de error útiles); si no se pasa, se usa el índice 1-based.
 */
export function filasDesdeMatriz(
  matriz: string[][],
  lineas?: number[],
): FilaConLinea[] {
  if (!matriz.length) return [];
  const normalizadas = matriz.map((f) => f.map(normalizarClave));
  let idxCabecera = normalizadas.findIndex((f) =>
    f.some((c) => CLAVES_CUIL.includes(c)),
  );
  if (idxCabecera < 0) {
    idxCabecera = normalizadas.findIndex((f) =>
      f.some((c) => CLAVES_NOMBRE.includes(c)),
    );
  }
  if (idxCabecera < 0) idxCabecera = 0;

  const cabeceras = normalizadas[idxCabecera];
  const filas: FilaConLinea[] = [];
  for (let i = idxCabecera + 1; i < matriz.length; i++) {
    const valores = matriz[i];
    if (valores.every((v) => !v || !v.trim())) continue;
    const fila: FilaCsv = {};
    cabeceras.forEach((col, j) => {
      if (col) fila[col] = (valores[j] ?? '').trim();
    });
    filas.push({ linea: lineas?.[i] ?? i + 1, datos: fila });
  }
  return filas;
}

/**
 * Devuelve las filas de datos del CSV como objetos indexados por el nombre de
 * columna (normalizado a minúsculas y sin acentos, para tolerar variantes de
 * cabecera), salteando el preámbulo previo a la cabecera real.
 */
export function parsearCsv(contenido: string): FilaConLinea[] {
  const texto = contenido.replace(/^﻿/, ''); // BOM de Excel
  const lineas = texto.split(/\r\n|\n|\r/);

  // El separador se decide con la línea de cabecera real: es la que contiene
  // la columna CUIL. (Contar separadores sobre todo el archivo engaña: los
  // importes con decimales usan coma, p. ej. "834975,75".)
  let sep = detectarSeparador(lineas.find((l) => l.trim()) ?? '');
  busqueda: for (const l of lineas) {
    for (const s of SEPARADORES) {
      const claves = parsearLinea(l, s).map(normalizarClave);
      if (claves.some((c) => CLAVES_CUIL.includes(c))) {
        sep = s;
        break busqueda;
      }
    }
  }

  const matriz: string[][] = [];
  const numeros: number[] = [];
  lineas.forEach((l, i) => {
    if (!l.trim()) return;
    matriz.push(parsearLinea(l, sep));
    numeros.push(i + 1);
  });
  return filasDesdeMatriz(matriz, numeros);
}

const DIACRITICOS = /[̀-ͯ]/g;

export function normalizarClave(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

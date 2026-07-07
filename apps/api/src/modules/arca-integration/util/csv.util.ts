/**
 * Parser de CSV mínimo y robusto para los archivos que exporta la Simplificación
 * Registral / "Mis Empleados" de ARCA. Soporta comillas dobles, separador coma o
 * punto y coma (autodetectado por la cabecera) y saltos CRLF/LF. Evitamos una
 * dependencia externa: el formato de entrada es acotado y conocido.
 */

export interface FilaCsv {
  [columna: string]: string;
}

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
 * Devuelve las filas como objetos indexados por el nombre de columna
 * (normalizado a minúsculas y sin acentos, para tolerar variantes de cabecera).
 */
export function parsearCsv(contenido: string): FilaCsv[] {
  const texto = contenido.replace(/^﻿/, ''); // BOM de Excel
  const lineas = texto.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (lineas.length < 2) return [];

  const sep = detectarSeparador(lineas[0]);
  const cabeceras = parsearLinea(lineas[0], sep).map(normalizarClave);

  return lineas.slice(1).map((linea) => {
    const valores = parsearLinea(linea, sep);
    const fila: FilaCsv = {};
    cabeceras.forEach((col, i) => {
      fila[col] = valores[i] ?? '';
    });
    return fila;
  });
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

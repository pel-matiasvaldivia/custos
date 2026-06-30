/**
 * M1 — Detección de cobertura: lógica de dominio PURA (sin DB).
 * Fuente: MODELO_MOTOR_DE_TIEMPO_Y_CUADRANTE.md §6 (L238).
 *
 * Para la ventana requerida de un puesto, compara la dotación simultánea de
 * turnos contra `dotacion_requerida` y reporta:
 *  - HUECO: dotación < requerida (descubierto)
 *  - SOBRE: dotación > requerida (sobre-dotación)
 *
 * Usa barrido por límites de intervalo (exacto) en vez de muestreo por minuto.
 *
 * SUPUESTO DOCUMENTADO (la ventana del spec sólo trae {horas_dia, dias} sin
 * hora de inicio): el tramo requerido de un día empieza a las 00:00 y dura
 * `horas_dia` horas. Para horas_dia=24 cubre el día completo. // TODO: si la
 * ventana incorpora hora_inicio, ajustar aquí.
 */

export interface Intervalo {
  inicio: Date;
  fin: Date;
}

export interface VentanaCobertura {
  horas_dia: number;
  dias: number[]; // ISO: 1=Lunes .. 7=Domingo
}

export type TipoCobertura = 'HUECO' | 'OK' | 'SOBRE';

export interface SegmentoCobertura {
  inicio: Date;
  fin: Date;
  dotacion: number;
  requerida: number;
  tipo: TipoCobertura;
}

const MS_DIA = 86_400_000;

function isoWeekday(d: Date): number {
  const js = d.getDay(); // 0=Dom..6=Sab
  return js === 0 ? 7 : js;
}

function medianoche(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Tramos requeridos por la ventana dentro de [desde, hasta]. */
function tramosRequeridos(
  ventana: VentanaCobertura,
  desde: Date,
  hasta: Date,
): Intervalo[] {
  const tramos: Intervalo[] = [];
  const horas = Math.min(24, Math.max(0, ventana.horas_dia));
  if (horas <= 0 || !ventana.dias?.length) return tramos;

  let dia = medianoche(desde).getTime();
  const finRango = hasta.getTime();
  while (dia <= finRango) {
    const d = new Date(dia);
    if (ventana.dias.includes(isoWeekday(d))) {
      const ini = dia;
      const fin = dia + horas * 3_600_000;
      // Recorta al rango analizado.
      const recIni = Math.max(ini, desde.getTime());
      const recFin = Math.min(fin, hasta.getTime());
      if (recFin > recIni) {
        tramos.push({ inicio: new Date(recIni), fin: new Date(recFin) });
      }
    }
    dia += MS_DIA;
  }
  return tramos;
}

/** Cantidad de turnos activos en el instante t (inicio <= t < fin). */
function activosEn(turnos: Intervalo[], t: number): number {
  let n = 0;
  for (const tu of turnos) {
    if (tu.inicio.getTime() <= t && t < tu.fin.getTime()) n++;
  }
  return n;
}

export interface ResultadoCobertura {
  huecos: SegmentoCobertura[];
  sobre: SegmentoCobertura[];
  segmentos: SegmentoCobertura[];
}

export function detectarCobertura(
  turnos: Intervalo[],
  dotacionRequerida: number,
  ventana: VentanaCobertura,
  desde: Date,
  hasta: Date,
): ResultadoCobertura {
  const tramos = tramosRequeridos(ventana, desde, hasta);
  const segmentos: SegmentoCobertura[] = [];

  for (const tramo of tramos) {
    // Límites internos: bordes de turnos que caen dentro del tramo.
    const limites = new Set<number>([
      tramo.inicio.getTime(),
      tramo.fin.getTime(),
    ]);
    for (const tu of turnos) {
      const i = tu.inicio.getTime();
      const f = tu.fin.getTime();
      if (i > tramo.inicio.getTime() && i < tramo.fin.getTime()) limites.add(i);
      if (f > tramo.inicio.getTime() && f < tramo.fin.getTime()) limites.add(f);
    }
    const ordenados = Array.from(limites).sort((a, b) => a - b);

    for (let k = 0; k < ordenados.length - 1; k++) {
      const s = ordenados[k];
      const e = ordenados[k + 1];
      if (e <= s) continue;
      const medio = (s + e) / 2;
      const dotacion = activosEn(turnos, medio);
      const tipo: TipoCobertura =
        dotacion < dotacionRequerida
          ? 'HUECO'
          : dotacion > dotacionRequerida
            ? 'SOBRE'
            : 'OK';
      segmentos.push({
        inicio: new Date(s),
        fin: new Date(e),
        dotacion,
        requerida: dotacionRequerida,
        tipo,
      });
    }
  }

  // Fusiona segmentos contiguos del mismo tipo y dotación.
  const fusionados: SegmentoCobertura[] = [];
  for (const seg of segmentos) {
    const ult = fusionados[fusionados.length - 1];
    if (
      ult &&
      ult.tipo === seg.tipo &&
      ult.dotacion === seg.dotacion &&
      ult.fin.getTime() === seg.inicio.getTime()
    ) {
      ult.fin = seg.fin;
    } else {
      fusionados.push({ ...seg });
    }
  }

  return {
    huecos: fusionados.filter((s) => s.tipo === 'HUECO'),
    sobre: fusionados.filter((s) => s.tipo === 'SOBRE'),
    segmentos: fusionados,
  };
}

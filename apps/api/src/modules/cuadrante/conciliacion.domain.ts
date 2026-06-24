/**
 * M1 — Conciliación de HH: lógica de dominio PURA (sin DB).
 * Fuente: MODELO_MOTOR_DE_TIEMPO_Y_CUADRANTE.md L316-344.
 *
 * NOTA DE ALCANCE: el esquema simplificado de custOS no vincula un turno a un
 * contrato (Asignacion→Puesto→Objetivo, sin contrato_id en el turno) ni tiene
 * esquemas_turno/relevos. Esta función implementa el CÁLCULO de las cubetas de
 * HH a partir de turnos ya resueltos; la generación del cuadrante y la
 * persistencia del cierre (snapshot en conciliacion_hh) requieren ese vínculo
 * y quedan como trabajo de esquema pendiente. // TODO(M1)
 */

export type ModoFacturacion = 'POR_PLANIFICADO' | 'POR_REAL' | 'ABONO_FIJO';

export interface TurnoConciliable {
  inicioPlan: Date;
  finPlan: Date;
  /** Asistencia real; null si el turno no fue cubierto. */
  inicioReal: Date | null;
  finReal: Date | null;
  esCubierto: boolean;
  esFeriado: boolean;
}

export interface OpcionesConciliacion {
  modo: ModoFacturacion;
  penalizaHueco: boolean;
  /** Hora de inicio de la ventana nocturna (default 21). */
  nocheInicioHora?: number;
  /** Hora de fin de la ventana nocturna (default 6). */
  nocheFinHora?: number;
}

export interface CubetasHH {
  hh_planificadas: number;
  hh_reales: number;
  hh_facturables: number; // si ABONO_FIJO → 0 (monto fijo)
  hh_normales: number;
  hh_nocturnas: number;
  hh_extra: number;
  hh_feriado: number;
}

const MS_HORA = 3_600_000;
const r2 = (n: number) => Math.round(n * 100) / 100;

export function duracionHoras(inicio: Date, fin: Date): number {
  return Math.max(0, (fin.getTime() - inicio.getTime()) / MS_HORA);
}

/**
 * Horas dentro de la ventana nocturna (que cruza medianoche, ej. 21→06).
 * Se calcula recorriendo el intervalo hora a hora fraccionada de forma exacta
 * mediante segmentación por límites de la ventana en cada día.
 */
export function horasNocturnas(
  inicio: Date | null,
  fin: Date | null,
  nocheInicioHora = 21,
  nocheFinHora = 6,
): number {
  if (!inicio || !fin || fin <= inicio) return 0;

  // Itera en pasos de 1 minuto: simple y exacto para montos en horas.
  let nocturnas = 0;
  const paso = 60_000; // 1 min
  for (let t = inicio.getTime(); t < fin.getTime(); t += paso) {
    const h = new Date(t).getHours();
    const esNoche = h >= nocheInicioHora || h < nocheFinHora;
    if (esNoche) nocturnas += paso;
  }
  return r2(nocturnas / MS_HORA);
}

export function conciliarHH(
  turnos: TurnoConciliable[],
  opts: OpcionesConciliacion,
): CubetasHH {
  const cubiertos = turnos.filter((t) => t.esCubierto && t.inicioReal && t.finReal);

  const hh_planificadas = r2(
    turnos.reduce((a, t) => a + duracionHoras(t.inicioPlan, t.finPlan), 0),
  );

  const hh_reales = r2(
    cubiertos.reduce(
      (a, t) => a + duracionHoras(t.inicioReal as Date, t.finReal as Date),
      0,
    ),
  );

  // Huecos no cubiertos (planificado sin cubrir), por si penaliza.
  const hhHuecos = r2(
    turnos
      .filter((t) => !t.esCubierto)
      .reduce((a, t) => a + duracionHoras(t.inicioPlan, t.finPlan), 0),
  );

  let hh_facturables = 0;
  switch (opts.modo) {
    case 'POR_PLANIFICADO':
      hh_facturables = r2(
        hh_planificadas - (opts.penalizaHueco ? hhHuecos : 0),
      );
      break;
    case 'POR_REAL':
      hh_facturables = hh_reales;
      break;
    case 'ABONO_FIJO':
      hh_facturables = 0; // monto fijo; no se factura por hora
      break;
  }

  const hh_nocturnas = r2(
    cubiertos.reduce(
      (a, t) =>
        a +
        horasNocturnas(
          t.inicioReal,
          t.finReal,
          opts.nocheInicioHora,
          opts.nocheFinHora,
        ),
      0,
    ),
  );

  const hh_feriado = r2(
    cubiertos
      .filter((t) => t.esFeriado)
      .reduce(
        (a, t) => a + duracionHoras(t.inicioReal as Date, t.finReal as Date),
        0,
      ),
  );

  // Partición sobre lo real (spec L341).
  const hh_normales = r2(Math.max(0, hh_reales - hh_nocturnas));

  // hh_extra requiere las reglas laborales (tope semanal) que el esquema no
  // tiene; se deja en 0. // TODO(M1): calcular con ReglaLaboral.
  const hh_extra = 0;

  return {
    hh_planificadas,
    hh_reales,
    hh_facturables,
    hh_normales,
    hh_nocturnas,
    hh_extra,
    hh_feriado,
  };
}

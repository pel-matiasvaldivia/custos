/**
 * M1 — Generación del cuadrante: lógica de dominio PURA (sin DB).
 * Fuente: MODELO_MOTOR_DE_TIEMPO_Y_CUADRANTE.md §3 y §6 (L213-235).
 *
 * Atribución de fecha (L54): el turno pertenece a la fecha de su inicio_plan,
 * aunque cruce medianoche.
 */

export interface BloqueDef {
  hora_inicio: string; // 'HH:MM'
  duracion_horas: number;
  tipo_bloque?: string; // DIURNO | NOCTURNO | MIXTO
}

export interface DiaDef {
  tipo: 'TRABAJO' | 'FRANCO';
  bloques?: BloqueDef[];
}

export interface EsquemaDef {
  dias_ciclo: number;
  dias: DiaDef[];
}

export interface TurnoGenerado {
  inicio_plan: Date;
  fin_plan: Date;
  tipo_bloque: string | null;
}

const MS_DIA = 86_400_000;

/** Medianoche local de una fecha (descarta la hora). */
function aMedianoche(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Días calendario completos entre dos fechas (b − a). */
function diffDias(a: Date, b: Date): number {
  return Math.round(
    (aMedianoche(a).getTime() - aMedianoche(b).getTime()) / MS_DIA,
  );
}

function combinar(fecha: Date, horaInicio: string): Date {
  const [hh, mm] = horaInicio.split(':').map((x) => parseInt(x, 10));
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    hh,
    mm || 0,
    0,
    0,
  );
}

function sumarHoras(d: Date, horas: number): Date {
  return new Date(d.getTime() + horas * 3_600_000);
}

export interface ParamsGeneracion {
  definicion: EsquemaDef;
  diasCiclo: number;
  posicionCiclo: number;
  fechaAncla: Date;
  desde: Date;
  hasta: Date;
}

/**
 * Genera los turnos concretos de una asignación de esquema en [desde, hasta].
 * Determinístico: misma entrada → misma salida.
 */
export function generarTurnosDesdeEsquema(
  p: ParamsGeneracion,
): TurnoGenerado[] {
  const N = p.diasCiclo;
  const turnos: TurnoGenerado[] = [];
  if (N <= 0) return turnos;

  const inicio = aMedianoche(p.desde);
  const fin = aMedianoche(p.hasta);

  for (let t = inicio.getTime(); t <= fin.getTime(); t += MS_DIA) {
    const fecha = new Date(t);
    const diasDesdeAncla = diffDias(fecha, p.fechaAncla);
    let idx = (diasDesdeAncla + p.posicionCiclo) % N;
    if (idx < 0) idx += N;

    const dia = p.definicion.dias[idx];
    if (!dia || dia.tipo === 'FRANCO' || !dia.bloques) continue;

    for (const b of dia.bloques) {
      const inicioPlan = combinar(fecha, b.hora_inicio);
      turnos.push({
        inicio_plan: inicioPlan,
        fin_plan: sumarHoras(inicioPlan, b.duracion_horas),
        tipo_bloque: b.tipo_bloque ?? null,
      });
    }
  }
  return turnos;
}

// ─── Elección automática de la posición de ciclo ─────────────────────────────

export interface AsignacionExistente {
  definicion: EsquemaDef;
  diasCiclo: number;
  posicionCiclo: number;
  fechaAncla: Date;
}

function mcd(a: number, b: number): number {
  return b === 0 ? a : mcd(b, a % b);
}

function solapamientoMs(
  a: { inicio_plan: Date; fin_plan: Date }[],
  b: { inicio_plan: Date; fin_plan: Date }[],
): number {
  let total = 0;
  for (const x of a) {
    for (const y of b) {
      const ini = Math.max(x.inicio_plan.getTime(), y.inicio_plan.getTime());
      const fin = Math.min(x.fin_plan.getTime(), y.fin_plan.getTime());
      if (fin > ini) total += fin - ini;
    }
  }
  return total;
}

/**
 * Elige la posición de ciclo para una NUEVA asignación de modo que sus turnos
 * se superpongan lo menos posible con los de las asignaciones ya activas del
 * puesto: así las personas quedan desfasadas dentro de la rotación (una cubre
 * la mañana cuando la otra cubre la tarde, francos repartidos) en vez de
 * repetir todas el mismo horario.
 *
 * Compara los turnos concretos que generaría cada posición candidata contra
 * los de las asignaciones existentes sobre un horizonte que cubre el patrón
 * combinado (mcm de los ciclos, acotado), y devuelve la posición con MENOR
 * tiempo superpuesto; a igualdad, la menor posición. Determinística.
 */
export function elegirPosicionCiclo(
  nuevo: { definicion: EsquemaDef; diasCiclo: number; fechaAncla: Date },
  existentes: AsignacionExistente[],
  desde: Date,
): number {
  const N = nuevo.diasCiclo;
  if (N <= 1 || existentes.length === 0) return 0;

  // Horizonte: el patrón conjunto se repite cada mcm(ciclos); acotamos a 84
  // días para mantener el costo bajo (sobra para comparar posiciones).
  let horizonte = N;
  for (const e of existentes) {
    horizonte = (horizonte * e.diasCiclo) / mcd(horizonte, e.diasCiclo);
    if (horizonte >= 84) break;
  }
  horizonte = Math.min(84, Math.max(horizonte, N));
  const hasta = new Date(desde.getTime() + (horizonte - 1) * MS_DIA);

  const turnosExistentes = existentes.map((e) =>
    generarTurnosDesdeEsquema({
      definicion: e.definicion,
      diasCiclo: e.diasCiclo,
      posicionCiclo: e.posicionCiclo,
      fechaAncla: e.fechaAncla,
      desde,
      hasta,
    }),
  );

  let mejor = 0;
  let mejorSolape = Infinity;
  for (let p = 0; p < N; p++) {
    const candidatos = generarTurnosDesdeEsquema({
      definicion: nuevo.definicion,
      diasCiclo: N,
      posicionCiclo: p,
      fechaAncla: nuevo.fechaAncla,
      desde,
      hasta,
    });
    let solape = 0;
    for (const t of turnosExistentes) {
      solape += solapamientoMs(candidatos, t);
    }
    if (solape < mejorSolape) {
      mejorSolape = solape;
      mejor = p;
      if (solape === 0) break; // p más chico con solape cero: no hay mejor
    }
  }
  return mejor;
}

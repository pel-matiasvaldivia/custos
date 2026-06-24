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
  return Math.round((aMedianoche(a).getTime() - aMedianoche(b).getTime()) / MS_DIA);
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
export function generarTurnosDesdeEsquema(p: ParamsGeneracion): TurnoGenerado[] {
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

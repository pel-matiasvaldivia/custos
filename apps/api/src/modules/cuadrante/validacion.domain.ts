/**
 * M1 — Validación de turnos: lógica de dominio PURA (sin DB).
 * Fuente: MODELO_MOTOR_DE_TIEMPO_Y_CUADRANTE.md §7 (L242-269).
 *
 * Reglas duras evaluables con la información disponible en el esquema actual:
 *  SOLAPAMIENTO, DESCANSO_INSUFICIENTE, EXCEDE_SEMANAL, EXCEDE_DIAS_CONSECUTIVOS.
 * (CREDENCIAL_VENCIDA se valida en el servicio contra la DB. MOVIL_NO_DISPONIBLE
 *  requiere un vínculo turno→vehículo que el esquema no tiene aún → // TODO.)
 */

export interface TurnoRef {
  inicio_plan: Date;
  fin_plan: Date;
}

export interface ReglasValidacion {
  jornadaMaxSemanalH: number;
  descansoMinEntreJornadasH: number;
  maxDiasConsecutivos: number;
}

export interface ResultadoValidacion {
  errores: string[];
  avisos: string[];
}

const MS_HORA = 3_600_000;
const MS_DIA = 86_400_000;

const horas = (a: Date, b: Date) =>
  Math.max(0, (b.getTime() - a.getTime()) / MS_HORA);

function diaKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Lunes (00:00) de la semana de la fecha. */
function inicioSemana(d: Date): number {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7; // lunes=0
  return x.getTime() - dow * MS_DIA;
}

export function validarTurno(
  candidato: TurnoRef,
  existentes: TurnoRef[],
  reglas: ReglasValidacion,
): ResultadoValidacion {
  const errores: string[] = [];
  const avisos: string[] = [];

  // 1) SOLAPAMIENTO
  const solapa = existentes.some(
    (e) =>
      candidato.inicio_plan < e.fin_plan && e.inicio_plan < candidato.fin_plan,
  );
  if (solapa) errores.push('SOLAPAMIENTO');

  // 2) DESCANSO_INSUFICIENTE (con el vecino anterior y posterior)
  const previos = existentes
    .filter((e) => e.fin_plan <= candidato.inicio_plan)
    .sort((a, b) => b.fin_plan.getTime() - a.fin_plan.getTime());
  if (previos.length > 0) {
    const gap = horas(previos[0].fin_plan, candidato.inicio_plan);
    if (gap < reglas.descansoMinEntreJornadasH)
      errores.push('DESCANSO_INSUFICIENTE');
  }
  const posteriores = existentes
    .filter((e) => e.inicio_plan >= candidato.fin_plan)
    .sort((a, b) => a.inicio_plan.getTime() - b.inicio_plan.getTime());
  if (posteriores.length > 0) {
    const gap = horas(candidato.fin_plan, posteriores[0].inicio_plan);
    if (
      gap < reglas.descansoMinEntreJornadasH &&
      !errores.includes('DESCANSO_INSUFICIENTE')
    ) {
      errores.push('DESCANSO_INSUFICIENTE');
    }
  }

  // 3) EXCEDE_SEMANAL
  const semanaCand = inicioSemana(candidato.inicio_plan);
  const horasSemana = existentes
    .filter((e) => inicioSemana(e.inicio_plan) === semanaCand)
    .reduce((acc, e) => acc + horas(e.inicio_plan, e.fin_plan), 0);
  if (
    horasSemana + horas(candidato.inicio_plan, candidato.fin_plan) >
    reglas.jornadaMaxSemanalH
  ) {
    avisos.push('GENERA_EXTRA');
    if (
      horasSemana + horas(candidato.inicio_plan, candidato.fin_plan) >
      reglas.jornadaMaxSemanalH
    ) {
      errores.push('EXCEDE_SEMANAL');
    }
  }

  // 4) EXCEDE_DIAS_CONSECUTIVOS (run de días con turno que incluye al candidato)
  const dias = new Set(existentes.map((e) => diaKey(e.inicio_plan)));
  dias.add(diaKey(candidato.inicio_plan));
  let run = 1;
  const base = new Date(
    candidato.inicio_plan.getFullYear(),
    candidato.inicio_plan.getMonth(),
    candidato.inicio_plan.getDate(),
  );
  for (let i = 1; ; i++) {
    const d = new Date(base.getTime() - i * MS_DIA);
    if (dias.has(diaKey(d))) run++;
    else break;
  }
  for (let i = 1; ; i++) {
    const d = new Date(base.getTime() + i * MS_DIA);
    if (dias.has(diaKey(d))) run++;
    else break;
  }
  if (run > reglas.maxDiasConsecutivos)
    errores.push('EXCEDE_DIAS_CONSECUTIVOS');

  return { errores, avisos };
}

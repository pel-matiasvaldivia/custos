import { validarTurno, TurnoRef, ReglasValidacion } from './validacion.domain';

const R: ReglasValidacion = {
  jornadaMaxSemanalH: 48,
  descansoMinEntreJornadasH: 12,
  maxDiasConsecutivos: 6,
};

const turno = (ini: string, fin: string): TurnoRef => ({
  inicio_plan: new Date(ini),
  fin_plan: new Date(fin),
});

describe('validarTurno', () => {
  it('turno válido sin existentes: sin errores', () => {
    const r = validarTurno(
      turno('2026-06-01T06:00', '2026-06-01T18:00'),
      [],
      R,
    );
    expect(r.errores).toEqual([]);
  });

  it('detecta SOLAPAMIENTO', () => {
    const existentes = [turno('2026-06-01T06:00', '2026-06-01T18:00')];
    const r = validarTurno(
      turno('2026-06-01T12:00', '2026-06-01T20:00'),
      existentes,
      R,
    );
    expect(r.errores).toContain('SOLAPAMIENTO');
  });

  it('detecta DESCANSO_INSUFICIENTE (menos de 12h entre turnos)', () => {
    const existentes = [turno('2026-06-01T06:00', '2026-06-01T18:00')];
    // nuevo turno arranca 4h después del fin anterior
    const r = validarTurno(
      turno('2026-06-01T22:00', '2026-06-02T06:00'),
      existentes,
      R,
    );
    expect(r.errores).toContain('DESCANSO_INSUFICIENTE');
  });

  it('respeta descanso suficiente (12h+)', () => {
    const existentes = [turno('2026-06-01T06:00', '2026-06-01T18:00')];
    const r = validarTurno(
      turno('2026-06-02T06:00', '2026-06-02T18:00'),
      existentes,
      R,
    );
    expect(r.errores).not.toContain('DESCANSO_INSUFICIENTE');
  });

  it('detecta EXCEDE_SEMANAL (>48h en la semana)', () => {
    // 4 turnos de 12h en la misma semana = 48h; el 5to (12h) excede
    const existentes = [
      turno('2026-06-01T06:00', '2026-06-01T18:00'),
      turno('2026-06-02T06:00', '2026-06-02T18:00'),
      turno('2026-06-03T06:00', '2026-06-03T18:00'),
      turno('2026-06-04T06:00', '2026-06-04T18:00'),
    ];
    const r = validarTurno(
      turno('2026-06-05T06:00', '2026-06-05T18:00'),
      existentes,
      R,
    );
    expect(r.errores).toContain('EXCEDE_SEMANAL');
  });

  it('detecta EXCEDE_DIAS_CONSECUTIVOS (7mo día seguido)', () => {
    const existentes = [
      turno('2026-06-01T06:00', '2026-06-01T18:00'),
      turno('2026-06-02T06:00', '2026-06-02T18:00'),
      turno('2026-06-03T06:00', '2026-06-03T18:00'),
      turno('2026-06-04T06:00', '2026-06-04T18:00'),
      turno('2026-06-05T06:00', '2026-06-05T18:00'),
      turno('2026-06-06T06:00', '2026-06-06T18:00'),
    ];
    const r = validarTurno(
      turno('2026-06-07T06:00', '2026-06-07T18:00'),
      existentes,
      R,
    );
    expect(r.errores).toContain('EXCEDE_DIAS_CONSECUTIVOS');
  });
});

import { generarTurnosDesdeEsquema, EsquemaDef } from './cuadrante.domain';

// Esquema 12×12 del spec §3: día0 diurno, día1 nocturno, día2/3 franco.
const ESQUEMA: EsquemaDef = {
  dias_ciclo: 4,
  dias: [
    {
      tipo: 'TRABAJO',
      bloques: [
        { hora_inicio: '06:00', duracion_horas: 12, tipo_bloque: 'DIURNO' },
      ],
    },
    {
      tipo: 'TRABAJO',
      bloques: [
        { hora_inicio: '18:00', duracion_horas: 12, tipo_bloque: 'NOCTURNO' },
      ],
    },
    { tipo: 'FRANCO' },
    { tipo: 'FRANCO' },
  ],
};

describe('generarTurnosDesdeEsquema', () => {
  const ancla = new Date(2026, 5, 1); // 2026-06-01

  it('posición 0: día0 diurno, día1 nocturno, día2/3 franco', () => {
    const turnos = generarTurnosDesdeEsquema({
      definicion: ESQUEMA,
      diasCiclo: 4,
      posicionCiclo: 0,
      fechaAncla: ancla,
      desde: new Date(2026, 5, 1),
      hasta: new Date(2026, 5, 4),
    });

    // 2 turnos (día0 y día1); día2 y día3 son franco
    expect(turnos).toHaveLength(2);
    expect(turnos[0].tipo_bloque).toBe('DIURNO');
    expect(turnos[0].inicio_plan.getHours()).toBe(6);
    expect(turnos[1].tipo_bloque).toBe('NOCTURNO');
    expect(turnos[1].inicio_plan.getDate()).toBe(2);
  });

  it('turno nocturno cruza medianoche (18:00 → 06:00 del día siguiente)', () => {
    const turnos = generarTurnosDesdeEsquema({
      definicion: ESQUEMA,
      diasCiclo: 4,
      posicionCiclo: 0,
      fechaAncla: ancla,
      desde: new Date(2026, 5, 2),
      hasta: new Date(2026, 5, 2),
    });
    expect(turnos).toHaveLength(1);
    expect(turnos[0].inicio_plan.getHours()).toBe(18);
    expect(turnos[0].fin_plan.getHours()).toBe(6);
    expect(turnos[0].fin_plan.getDate()).toBe(3); // día siguiente
  });

  it('posición de ciclo desplaza la rotación (pos 2 → día0 es franco)', () => {
    const turnos = generarTurnosDesdeEsquema({
      definicion: ESQUEMA,
      diasCiclo: 4,
      posicionCiclo: 2,
      fechaAncla: ancla,
      desde: new Date(2026, 5, 1),
      hasta: new Date(2026, 5, 1),
    });
    // pos 2 en día0 → idx 2 = FRANCO → sin turnos
    expect(turnos).toHaveLength(0);
  });

  it('cuatro vigiladores (pos 0..3) cubren el puesto sin huecos en un día', () => {
    const dia = new Date(2026, 5, 1);
    const todos = [0, 1, 2, 3].flatMap((pos) =>
      generarTurnosDesdeEsquema({
        definicion: ESQUEMA,
        diasCiclo: 4,
        posicionCiclo: pos,
        fechaAncla: ancla,
        desde: dia,
        hasta: dia,
      }),
    );
    // En un día dado debe haber exactamente un diurno y un nocturno cubiertos.
    const diurnos = todos.filter((t) => t.tipo_bloque === 'DIURNO');
    const nocturnos = todos.filter((t) => t.tipo_bloque === 'NOCTURNO');
    expect(diurnos).toHaveLength(1);
    expect(nocturnos).toHaveLength(1);
  });
});

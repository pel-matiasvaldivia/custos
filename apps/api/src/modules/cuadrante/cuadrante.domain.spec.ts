import {
  generarTurnosDesdeEsquema,
  elegirPosicionCiclo,
  EsquemaDef,
} from './cuadrante.domain';

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

describe('elegirPosicionCiclo', () => {
  const ancla = new Date(2026, 6, 1); // 2026-07-01
  const desde = new Date(2026, 6, 1);

  // Ciclo 6 días estilo "4x2": 2 mañanas, 2 tardes, 2 francos (12 h c/u).
  const ESQUEMA_MMTTFF: EsquemaDef = {
    dias_ciclo: 6,
    dias: [
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '06:00', duracion_horas: 12, tipo_bloque: 'DIURNO' }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '06:00', duracion_horas: 12, tipo_bloque: 'DIURNO' }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '18:00', duracion_horas: 12, tipo_bloque: 'NOCTURNO' }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '18:00', duracion_horas: 12, tipo_bloque: 'NOCTURNO' }] },
      { tipo: 'FRANCO' },
      { tipo: 'FRANCO' },
    ],
  };

  const asignacion = (posicionCiclo: number, definicion = ESQUEMA_MMTTFF) => ({
    definicion,
    diasCiclo: definicion.dias_ciclo,
    posicionCiclo,
    fechaAncla: ancla,
  });

  const nuevo = (definicion = ESQUEMA_MMTTFF) => ({
    definicion,
    diasCiclo: definicion.dias_ciclo,
    fechaAncla: ancla,
  });

  it('sin asignaciones previas arranca en la posición 0', () => {
    expect(elegirPosicionCiclo(nuevo(), [], desde)).toBe(0);
  });

  it('el segundo vigilador queda desfasado sin superponer horarios (pos 2)', () => {
    // pos 1 repetiría mañanas/tardes con el primero; pos 2 lo complementa.
    expect(elegirPosicionCiclo(nuevo(), [asignacion(0)], desde)).toBe(2);
  });

  it('el tercer vigilador completa la rotación (pos 4): M, T y franco cada día', () => {
    const p = elegirPosicionCiclo(nuevo(), [asignacion(0), asignacion(2)], desde);
    expect(p).toBe(4);

    // Con {0, 2, 4} cada día del ciclo tiene exactamente 1 mañana y 1 tarde.
    const dia = new Date(2026, 6, 10);
    const turnosDia = [0, 2, 4].flatMap((pos) =>
      generarTurnosDesdeEsquema({
        definicion: ESQUEMA_MMTTFF,
        diasCiclo: 6,
        posicionCiclo: pos,
        fechaAncla: ancla,
        desde: dia,
        hasta: dia,
      }),
    );
    expect(turnosDia.filter((t) => t.tipo_bloque === 'DIURNO')).toHaveLength(1);
    expect(turnosDia.filter((t) => t.tipo_bloque === 'NOCTURNO')).toHaveLength(1);
  });

  it('si no hay posición libre elige la de menor superposición', () => {
    // Las 6 posiciones ocupadas: cualquier posición repite a alguien, pero la
    // función devuelve una posición válida del ciclo en forma determinística.
    const existentes = [0, 1, 2, 3, 4, 5].map((p) => asignacion(p));
    const p = elegirPosicionCiclo(nuevo(), existentes, desde);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThan(6);
  });

  it('con el esquema 12×12 del spec el segundo vigilador no repite bloque', () => {
    const p = elegirPosicionCiclo(nuevo(ESQUEMA), [asignacion(0, ESQUEMA)], desde);
    // Cualquier posición ≥1 tiene solape cero con la 0; gana la menor (1).
    expect(p).toBe(1);
  });
});

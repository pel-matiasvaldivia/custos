import {
  duracionHoras,
  horasNocturnas,
  conciliarHH,
  TurnoConciliable,
} from './conciliacion.domain';

const D = (s: string) => new Date(s);

describe('conciliacion.domain', () => {
  describe('duracionHoras', () => {
    it('calcula horas entre dos fechas', () => {
      expect(duracionHoras(D('2026-06-01T08:00'), D('2026-06-01T20:00'))).toBe(12);
    });
    it('0 si fin <= inicio', () => {
      expect(duracionHoras(D('2026-06-01T20:00'), D('2026-06-01T08:00'))).toBe(0);
    });
  });

  describe('horasNocturnas (ventana 21→06)', () => {
    it('turno diurno 08–20 → 0 nocturnas', () => {
      expect(horasNocturnas(D('2026-06-01T08:00'), D('2026-06-01T20:00'))).toBe(0);
    });
    it('turno nocturno 20–08 → 10 nocturnas (21→06)', () => {
      // 20:00→08:00 = 12h; nocturnas entre 21 y 06 = 9h (21-06) ... 20-21 no, 06-08 no
      expect(horasNocturnas(D('2026-06-01T20:00'), D('2026-06-02T08:00'))).toBe(9);
    });
    it('null si falta asistencia', () => {
      expect(horasNocturnas(null, D('2026-06-01T20:00'))).toBe(0);
    });
  });

  describe('conciliarHH', () => {
    const turnos: TurnoConciliable[] = [
      {
        inicioPlan: D('2026-06-01T08:00'),
        finPlan: D('2026-06-01T20:00'),
        inicioReal: D('2026-06-01T08:00'),
        finReal: D('2026-06-01T20:00'),
        esCubierto: true,
        esFeriado: false,
      },
      {
        // hueco no cubierto
        inicioPlan: D('2026-06-02T08:00'),
        finPlan: D('2026-06-02T20:00'),
        inicioReal: null,
        finReal: null,
        esCubierto: false,
        esFeriado: false,
      },
    ];

    it('POR_PLANIFICADO sin penalización: facturables = planificadas', () => {
      const r = conciliarHH(turnos, { modo: 'POR_PLANIFICADO', penalizaHueco: false });
      expect(r.hh_planificadas).toBe(24);
      expect(r.hh_reales).toBe(12);
      expect(r.hh_facturables).toBe(24);
    });

    it('POR_PLANIFICADO con penalización: descuenta huecos', () => {
      const r = conciliarHH(turnos, { modo: 'POR_PLANIFICADO', penalizaHueco: true });
      expect(r.hh_facturables).toBe(12); // 24 - 12 hueco
    });

    it('POR_REAL: facturables = reales', () => {
      const r = conciliarHH(turnos, { modo: 'POR_REAL', penalizaHueco: false });
      expect(r.hh_facturables).toBe(12);
    });

    it('ABONO_FIJO: facturables = 0', () => {
      const r = conciliarHH(turnos, { modo: 'ABONO_FIJO', penalizaHueco: false });
      expect(r.hh_facturables).toBe(0);
    });

    it('normales = reales − nocturnas', () => {
      const r = conciliarHH(turnos, { modo: 'POR_REAL', penalizaHueco: false });
      expect(r.hh_normales).toBe(r.hh_reales - r.hh_nocturnas);
    });
  });
});

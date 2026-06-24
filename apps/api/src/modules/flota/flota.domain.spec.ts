import {
  movilDisponibleYVigente,
  calcularRendimiento,
  planMantenimientoDisparo,
  calcularTCO,
  prorratearTCO,
} from './flota.domain';

describe('flota.domain', () => {
  describe('movilDisponibleYVigente', () => {
    const hoy = new Date('2026-06-01');
    it('bloquea si está EN_TALLER', () => {
      expect(movilDisponibleYVigente('EN_TALLER', [], hoy)).toBe(false);
    });
    it('bloquea si la VTV está vencida', () => {
      expect(
        movilDisponibleYVigente(
          'OPERATIVO',
          [{ tipo: 'VTV', vence_el: new Date('2026-05-01') }],
          hoy,
        ),
      ).toBe(false);
    });
    it('permite si está OPERATIVO y vencimientos vigentes', () => {
      expect(
        movilDisponibleYVigente(
          'OPERATIVO',
          [{ tipo: 'SEGURO', vence_el: new Date('2026-12-01') }],
          hoy,
        ),
      ).toBe(true);
    });
    it('ignora vencimientos no críticos (PATENTE)', () => {
      expect(
        movilDisponibleYVigente(
          'OPERATIVO',
          [{ tipo: 'PATENTE', vence_el: new Date('2026-01-01') }],
          hoy,
        ),
      ).toBe(true);
    });
  });

  describe('calcularRendimiento', () => {
    it('calcula km/l', () => {
      expect(calcularRendimiento(10500, 10000, 50)).toBe(10);
    });
    it('null sin carga anterior', () => {
      expect(calcularRendimiento(10500, null, 50)).toBeNull();
    });
    it('null si km no avanzó', () => {
      expect(calcularRendimiento(10000, 10000, 50)).toBeNull();
    });
  });

  describe('planMantenimientoDisparo', () => {
    it('KM: dispara al superar el umbral', () => {
      expect(
        planMantenimientoDisparo({ disparo: 'KM', cada_km: 10000, ultimo_km: 5000 }, 16000),
      ).toBe(true);
    });
    it('KM: no dispara si no llegó', () => {
      expect(
        planMantenimientoDisparo({ disparo: 'KM', cada_km: 10000, ultimo_km: 5000 }, 12000),
      ).toBe(false);
    });
    it('TIEMPO: dispara por meses transcurridos', () => {
      expect(
        planMantenimientoDisparo(
          { disparo: 'TIEMPO', cada_meses: 6, ultima_fecha: new Date('2026-01-01') },
          0,
          new Date('2026-07-01'),
        ),
      ).toBe(true);
    });
  });

  describe('calcularTCO + prorratearTCO', () => {
    it('TCO = depreciación + OT + combustible', () => {
      expect(calcularTCO(100000, 50000, 30000)).toBe(180000);
    });
    it('prorratea por horas de asignación a contratos', () => {
      const map = prorratearTCO(180000, [
        { contrato_id: 'A', horas: 100 },
        { contrato_id: 'B', horas: 300 },
        { contrato_id: null, horas: 50 }, // no imputable
      ]);
      // total horas imputables = 400 → A: 25%, B: 75%
      expect(map.get('A')).toBe(45000);
      expect(map.get('B')).toBe(135000);
      expect(map.has(null as any)).toBe(false);
    });
    it('mapa vacío si no hay horas imputables', () => {
      expect(prorratearTCO(180000, [{ contrato_id: null, horas: 10 }]).size).toBe(0);
    });
  });
});

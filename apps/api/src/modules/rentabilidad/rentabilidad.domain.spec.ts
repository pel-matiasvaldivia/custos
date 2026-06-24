import { calcularRentabilidad } from './rentabilidad.domain';

describe('calcularRentabilidad (dominio puro)', () => {
  it('calcula margen y costo real según la fórmula del spec', () => {
    const r = calcularRentabilidad({
      facturacion: 1_000_000,
      costoLaboral: 600_000,
      comprasImputadas: 50_000,
      flotaImputada: 30_000,
      umbralErosion: 0.25,
    });

    // costoReal = 600k + 50k + 30k = 680k
    expect(r.costoReal).toBe(680_000);
    // margen = 1M - 680k = 320k
    expect(r.margen).toBe(320_000);
    // margenPct = 320k / 1M = 0.32
    expect(r.margenPct).toBe(0.32);
    // 0.32 >= 0.25 → no erosionado
    expect(r.erosionado).toBe(false);
  });

  it('marca erosionado cuando el margen cae bajo el umbral', () => {
    const r = calcularRentabilidad({
      facturacion: 1_000_000,
      costoLaboral: 800_000,
      comprasImputadas: 50_000,
      flotaImputada: 30_000,
      umbralErosion: 0.25,
    });

    // margen = 1M - 880k = 120k → 0.12 < 0.25
    expect(r.margen).toBe(120_000);
    expect(r.margenPct).toBe(0.12);
    expect(r.erosionado).toBe(true);
  });

  it('margen negativo cuando el costo real supera la facturación', () => {
    const r = calcularRentabilidad({
      facturacion: 500_000,
      costoLaboral: 600_000,
      comprasImputadas: 0,
      flotaImputada: 0,
      umbralErosion: 0.25,
    });

    expect(r.margen).toBe(-100_000);
    expect(r.erosionado).toBe(true);
  });

  it('no divide por cero: margenPct = 0 si no hay facturación', () => {
    const r = calcularRentabilidad({
      facturacion: 0,
      costoLaboral: 0,
      comprasImputadas: 0,
      flotaImputada: 0,
      umbralErosion: 0.25,
    });

    expect(r.margenPct).toBe(0);
    expect(r.margen).toBe(0);
    // 0 < 0.25 → erosionado (sin facturación no hay margen sano)
    expect(r.erosionado).toBe(true);
  });

  it('redondea montos a 2 decimales y porcentaje a 4', () => {
    const r = calcularRentabilidad({
      facturacion: 333.333,
      costoLaboral: 111.111,
      comprasImputadas: 0,
      flotaImputada: 0,
      umbralErosion: 0.25,
    });

    expect(r.facturacion).toBe(333.33);
    expect(r.costoReal).toBe(111.11);
    expect(Number.isInteger(r.margenPct * 10000)).toBe(true);
  });
});

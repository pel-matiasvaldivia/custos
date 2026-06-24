import { detectarCobertura, Intervalo, VentanaCobertura } from './cobertura.domain';

const I = (ini: string, fin: string): Intervalo => ({
  inicio: new Date(ini),
  fin: new Date(fin),
});

// Ventana 24h, todos los días.
const V247: VentanaCobertura = { horas_dia: 24, dias: [1, 2, 3, 4, 5, 6, 7] };

describe('detectarCobertura', () => {
  const desde = new Date(2026, 5, 1, 0, 0); // 2026-06-01 00:00
  const hasta = new Date(2026, 5, 2, 0, 0); // 2026-06-02 00:00 (un día)

  it('sin turnos: todo el día es hueco', () => {
    const r = detectarCobertura([], 1, V247, desde, hasta);
    expect(r.huecos).toHaveLength(1);
    expect(r.huecos[0].inicio).toEqual(desde);
    expect(r.huecos[0].fin).toEqual(hasta);
  });

  it('cobertura 24h con dos turnos 12h contiguos: sin huecos', () => {
    const turnos = [
      I('2026-06-01T00:00', '2026-06-01T12:00'),
      I('2026-06-01T12:00', '2026-06-02T00:00'),
    ];
    const r = detectarCobertura(turnos, 1, V247, desde, hasta);
    expect(r.huecos).toHaveLength(0);
    expect(r.sobre).toHaveLength(0);
  });

  it('detecta hueco cuando falta un tramo', () => {
    const turnos = [
      I('2026-06-01T00:00', '2026-06-01T08:00'),
      // hueco 08:00–10:00
      I('2026-06-01T10:00', '2026-06-02T00:00'),
    ];
    const r = detectarCobertura(turnos, 1, V247, desde, hasta);
    expect(r.huecos).toHaveLength(1);
    expect(r.huecos[0].inicio).toEqual(new Date('2026-06-01T08:00'));
    expect(r.huecos[0].fin).toEqual(new Date('2026-06-01T10:00'));
  });

  it('detecta sobre-dotación cuando dos turnos se solapan', () => {
    const turnos = [
      I('2026-06-01T00:00', '2026-06-01T12:00'),
      I('2026-06-01T06:00', '2026-06-01T18:00'), // solapa 06–12
      I('2026-06-01T18:00', '2026-06-02T00:00'),
    ];
    const r = detectarCobertura(turnos, 1, V247, desde, hasta);
    expect(r.sobre).toHaveLength(1);
    expect(r.sobre[0].inicio).toEqual(new Date('2026-06-01T06:00'));
    expect(r.sobre[0].fin).toEqual(new Date('2026-06-01T12:00'));
    expect(r.sobre[0].dotacion).toBe(2);
  });

  it('respeta dotación requerida > 1', () => {
    const turnos = [I('2026-06-01T00:00', '2026-06-02T00:00')]; // 1 solo cubriendo
    const r = detectarCobertura(turnos, 2, V247, desde, hasta);
    // requiere 2, hay 1 → todo hueco
    expect(r.huecos).toHaveLength(1);
    expect(r.huecos[0].dotacion).toBe(1);
  });

  it('solo evalúa los días de la ventana', () => {
    // Ventana solo lunes (2026-06-01 es lunes). Rango de 2 días → solo el lunes cuenta.
    const soloLunes: VentanaCobertura = { horas_dia: 24, dias: [1] };
    const dosDias = new Date(2026, 5, 3, 0, 0);
    const r = detectarCobertura([], 1, soloLunes, desde, dosDias);
    // Un único tramo requerido (lunes) sin cubrir.
    expect(r.huecos).toHaveLength(1);
    expect(r.huecos[0].fin).toEqual(new Date(2026, 5, 2, 0, 0));
  });
});

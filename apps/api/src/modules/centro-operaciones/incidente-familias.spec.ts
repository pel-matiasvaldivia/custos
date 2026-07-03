import { familiaDeTipo, mismaFamilia } from './incidente-familias';

describe('incidente-familias', () => {
  it('agrupa tipos de seguridad física en la misma familia', () => {
    expect(mismaFamilia('INTRUSION', 'PANICO')).toBe(true);
    expect(mismaFamilia('INTRUSION', 'PANICO_MOVIL')).toBe(true);
    expect(mismaFamilia('APERTURA', 'INTRUSION')).toBe(true);
  });

  it('agrupa tipos de emergencia de vida en la misma familia', () => {
    expect(mismaFamilia('FUEGO', 'GAS')).toBe(true);
    expect(mismaFamilia('FUEGO', 'HUMO')).toBe(true);
  });

  it('no fusiona familias de respuesta distintas (FUEGO vs INTRUSION)', () => {
    expect(mismaFamilia('FUEGO', 'INTRUSION')).toBe(false);
    expect(mismaFamilia('PANICO', 'FUEGO')).toBe(false);
  });

  it('un tipo desconocido solo se fusiona con su mismo tipo exacto', () => {
    expect(familiaDeTipo('RAREZA')).toBe('OTRO:RAREZA');
    expect(mismaFamilia('RAREZA', 'RAREZA')).toBe(true);
    expect(mismaFamilia('RAREZA', 'INTRUSION')).toBe(false);
    expect(mismaFamilia('RAREZA', 'OTRA_RAREZA')).toBe(false);
  });
});

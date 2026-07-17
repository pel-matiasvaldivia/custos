import { parsearCsv, filasDesdeMatriz, normalizarClave } from './csv.util';

// Réplica (recortada) del CSV real que exporta "Consulta Nómina" de ARCA:
// 4 líneas de preámbulo antes de la cabecera, decimales con coma entre
// comillas y una cola de columnas de aportes/contribuciones.
const CSV_ARCA = [
  'CUIT:,30-71728463-8,,,',
  'Período,05 2026,,,',
  'Secuencia:,0 - Original,,,',
  'Contribuyente:,SEV-AND SECURITY S. A. S.,,,',
  'CUIL,Apellido y Nombre,Obra Social,Situación,Remuneración Total',
  '20186078609,CLAUDIO WALTER MENDOZA,115300,1,"834975,75"',
  '20263610203,PABLO MAURICIO ARANGUEZ,121705,6,0',
  '',
].join('\r\n');

describe('parsearCsv (formato ARCA)', () => {
  it('saltea el preámbulo y toma la fila con CUIL como cabecera', () => {
    const filas = parsearCsv(CSV_ARCA);
    expect(filas).toHaveLength(2);
    expect(filas[0].datos['cuil']).toBe('20186078609');
    expect(filas[0].datos['apellido_y_nombre']).toBe('CLAUDIO WALTER MENDOZA');
    expect(filas[0].datos['remuneracion_total']).toBe('834975,75');
    expect(filas[1].datos['cuil']).toBe('20263610203');
  });

  it('conserva el número de línea original para los errores', () => {
    const filas = parsearCsv(CSV_ARCA);
    expect(filas[0].linea).toBe(6);
    expect(filas[1].linea).toBe(7);
  });

  it('sigue soportando un CSV simple con cabecera en la primera línea', () => {
    const filas = parsearCsv(
      'cuil,apellido,nombre\n20111111112,PEREZ,JUAN\n',
    );
    expect(filas).toHaveLength(1);
    expect(filas[0].datos['apellido']).toBe('PEREZ');
    expect(filas[0].linea).toBe(2);
  });

  it('autodetecta punto y coma aunque los decimales usen coma', () => {
    const csv = [
      'CUIT:;30-71728463-8',
      'CUIL;Apellido y Nombre;Remuneración Total',
      '20186078609;CLAUDIO WALTER MENDOZA;834975,75',
    ].join('\n');
    const filas = parsearCsv(csv);
    expect(filas).toHaveLength(1);
    expect(filas[0].datos['cuil']).toBe('20186078609');
    expect(filas[0].datos['remuneracion_total']).toBe('834975,75');
  });
});

describe('filasDesdeMatriz', () => {
  it('descarta filas totalmente vacías', () => {
    const filas = filasDesdeMatriz([
      ['CUIL', 'Apellido'],
      ['', ''],
      ['20111111112', 'PEREZ'],
    ]);
    expect(filas).toHaveLength(1);
    expect(filas[0].datos['cuil']).toBe('20111111112');
  });

  it('cae a la primera fila como cabecera si no hay columna CUIL ni nombre', () => {
    const filas = filasDesdeMatriz([
      ['col_a', 'col_b'],
      ['1', '2'],
    ]);
    expect(filas).toHaveLength(1);
    expect(filas[0].datos['col_a']).toBe('1');
  });
});

describe('normalizarClave', () => {
  it('normaliza acentos, espacios y mayúsculas', () => {
    expect(normalizarClave('Remuneración Total')).toBe('remuneracion_total');
    expect(normalizarClave('Apellido y Nombre')).toBe('apellido_y_nombre');
  });
});

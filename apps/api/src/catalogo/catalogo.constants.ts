// Valores por defecto de cada lista configurable. El tenant puede agregar los
// suyos desde Configuración; estos siguen disponibles aunque no haya filas en DB.
export const CATALOGO_DEFAULTS: Record<
  string,
  { codigo: string; etiqueta: string }[]
> = {
  CREDENCIAL_TIPO: [
    { codigo: 'CARNET_VIGILADOR', etiqueta: 'Carnet de Vigilador' },
    { codigo: 'PSICOFISICO', etiqueta: 'Psicofísico' },
    { codigo: 'ANTECEDENTES', etiqueta: 'Certificado de Antecedentes' },
    { codigo: 'ANMAC', etiqueta: 'Credencial ANMAC' },
    { codigo: 'CAPACITACION', etiqueta: 'Capacitación' },
  ],
};

export function slugifyCodigo(etiqueta: string): string {
  return etiqueta
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

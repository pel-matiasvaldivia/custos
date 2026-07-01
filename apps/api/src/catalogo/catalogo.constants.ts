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
  // Tipos de novedad usados en el módulo de Operaciones. El tenant puede
  // sumar los suyos (ej. "Adelanto de sueldo", "Ausente con aviso", etc.).
  NOVEDAD_TIPO: [
    { codigo: 'GENERAL', etiqueta: 'General' },
    { codigo: 'ALARMA', etiqueta: 'Alarma' },
    { codigo: 'RELEVAMIENTO', etiqueta: 'Relevamiento' },
    { codigo: 'EMERGENCIA', etiqueta: 'Emergencia' },
    { codigo: 'ADELANTO_SUELDO', etiqueta: 'Adelanto de sueldo' },
    { codigo: 'AUSENTE_CON_AVISO', etiqueta: 'Ausente con aviso' },
    { codigo: 'AUSENTE_SIN_AVISO', etiqueta: 'Ausente sin aviso' },
    { codigo: 'LLEGADA_TARDE', etiqueta: 'Llegada tarde' },
    { codigo: 'SUSPENSION', etiqueta: 'Suspensión' },
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

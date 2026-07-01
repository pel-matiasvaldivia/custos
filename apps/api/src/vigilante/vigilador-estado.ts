/**
 * Estados posibles de un vigilador y su disponibilidad para ser afectado a un
 * puesto dentro de un esquema de turno. Solo el personal ACTIVO puede vincularse
 * a un puesto; el resto está temporal o definitivamente no disponible.
 *
 * Se aceptan además los alias legacy ('SUSPENDIDO') para no romper registros
 * cargados antes de esta convención.
 */
export const VIGILADOR_ESTADOS = ['ACTIVO', 'PE', 'SP', 'VC', 'LC', 'BAJA'] as const;
export type VigiladorEstado = (typeof VIGILADOR_ESTADOS)[number];

/** Valores aceptados por la API (incluye alias legacy). */
export const VIGILADOR_ESTADOS_ACEPTADOS = [...VIGILADOR_ESTADOS, 'SUSPENDIDO', 'INACTIVO'];

export const VIGILADOR_ESTADO_LABEL: Record<string, string> = {
  ACTIVO: 'Activo',
  PE: 'Parte de Enfermo',
  SP: 'Suspendido',
  VC: 'Vacaciones',
  LC: 'Licencia Especial',
  BAJA: 'Baja',
  SUSPENDIDO: 'Suspendido',
  INACTIVO: 'Inactivo',
};

/** Solo el personal ACTIVO puede afectarse a un puesto en un esquema de turno. */
export function estaDisponibleParaAsignacion(estado: string): boolean {
  return estado === 'ACTIVO';
}

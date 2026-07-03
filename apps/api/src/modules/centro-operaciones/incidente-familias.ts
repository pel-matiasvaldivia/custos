/**
 * Familias de respuesta de incidentes.
 *
 * La correlación de eventos (fusión en un incidente abierto) solo agrupa eventos
 * de la MISMA familia: tipos de familias distintas disparan protocolos de
 * respuesta distintos (FUEGO → bomberos/evacuación vs INTRUSION → policía/despacho
 * de móvil) y el `tipo` del incidente define la SOP que se ejecuta, así que
 * mezclarlos daría un protocolo y métricas incorrectos.
 *
 * Un tipo desconocido forma su propia familia (`OTRO:<tipo>`): solo se fusiona
 * con un incidente abierto de su mismo tipo exacto.
 */
const FAMILIA_POR_TIPO: Record<string, string> = {
  // Seguridad física → respuesta policial / despacho de móvil.
  INTRUSION: 'SEGURIDAD_FISICA',
  PANICO: 'SEGURIDAD_FISICA',
  PANICO_MOVIL: 'SEGURIDAD_FISICA',
  APERTURA: 'SEGURIDAD_FISICA',
  // Emergencia de vida → bomberos / evacuación.
  FUEGO: 'EMERGENCIA_VIDA',
  GAS: 'EMERGENCIA_VIDA',
  HUMO: 'EMERGENCIA_VIDA',
};

/** Familia de respuesta de un tipo de incidente/evento. */
export function familiaDeTipo(tipo: string): string {
  return FAMILIA_POR_TIPO[tipo] ?? `OTRO:${tipo}`;
}

/** ¿Dos tipos pertenecen a la misma familia de respuesta (fusionables)? */
export function mismaFamilia(a: string, b: string): boolean {
  return familiaDeTipo(a) === familiaDeTipo(b);
}

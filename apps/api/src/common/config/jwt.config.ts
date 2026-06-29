/**
 * Secreto JWT, sin fallback. Si falta, el proceso falla en el arranque en lugar
 * de aceptar tokens firmados con un secreto público (forja de identidad/tenant).
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET es obligatorio: definilo en el entorno (sin fallback).');
  }
  return secret;
}

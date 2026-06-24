import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restringe un endpoint a los roles indicados.
 * Roles del dominio: ADMIN | GERENCIA | SUPERVISOR | OPERADOR | RRHH | COMPRAS
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

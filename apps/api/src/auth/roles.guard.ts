import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/**
 * Aplica control de acceso por rol. Debe usarse DESPUÉS de JwtAuthGuard,
 * que es quien puebla `req.user = { userId, email, tenantId, role }`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !rolesRequeridos.includes(user.role)) {
      throw new ForbiddenException(
        'No tenés permisos para acceder a este recurso',
      );
    }
    return true;
  }
}

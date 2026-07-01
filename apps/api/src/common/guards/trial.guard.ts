import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';

/** Rutas que nunca bloquea el guard aunque el plan esté vencido. */
const BYPASS_PREFIXES = [
  '/auth',
  '/mobile/auth',
  '/suscripcion',
];

/**
 * Guard que bloquea escrituras cuando el trial venció.
 * - Lectura (GET, HEAD) siempre permitida.
 * - TRIAL vencido → auto-transición a VENCIDO + bloqueo de escritura.
 * - VENCIDO → bloqueo de escritura con código TRIAL_EXPIRED.
 * - ACTIVO / SUSPENDIDO → pasa sin restricción de plan (SUSPENDIDO puede
 *   tener lógica propia en el futuro).
 * Debe registrarse DESPUÉS de JwtAuthGuard para tener req.user disponible.
 */
@Injectable()
export class TrialGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaAdminService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    // Bypass: rutas públicas (sin user en el request) o endpoints de suscripción
    if (!req.user) return true;
    const path: string = req.path ?? '';
    if (BYPASS_PREFIXES.some((p) => path.startsWith(p))) return true;

    // Lecturas siempre permitidas (no consumen el plan)
    const method: string = req.method ?? 'GET';
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

    const tenantId: string = req.user.tenantId;
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true, trial_hasta: true },
    });
    if (!tenant) return true; // No debería ocurrir; JwtStrategy ya valida

    let plan = tenant.plan;

    // Auto-transición TRIAL → VENCIDO cuando venció
    if (
      plan === 'TRIAL' &&
      tenant.trial_hasta &&
      tenant.trial_hasta < new Date()
    ) {
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { plan: 'VENCIDO' },
      });
      plan = 'VENCIDO';
    }

    if (plan === 'VENCIDO') {
      throw new ForbiddenException({
        code: 'TRIAL_EXPIRED',
        message:
          'Tu período de prueba finalizó. Suscribite para continuar operando.',
      });
    }

    return true;
  }
}

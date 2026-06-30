import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaAdminService } from '../prisma/prisma-admin.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // El login es pre-auth: busca al usuario por email global, sin contexto de
  // tenant. Usa el cliente admin (omite RLS); el resto del sistema usa RLS.
  constructor(
    private prisma: PrismaAdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    // Check if locked
    if (user.locked_until && user.locked_until > new Date()) {
      throw new UnauthorizedException(
        `Cuenta bloqueada temporalmente hasta ${user.locked_until.toISOString()}`,
      );
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      // Reset on success
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failed_attempts: 0, locked_until: null },
      });
      const { password, ...result } = user;
      return result;
    } else {
      // Increment failed attempts
      const newAttempts = user.failed_attempts + 1;
      let lockedUntil = null;

      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 60 * 60 * 1000); // Lock for 1 hour
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failed_attempts: newAttempts, locked_until: lockedUntil },
      });

      return null;
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
    };
  }

  /** SUPERADMIN-only: lista todos los tenants para elegir a cuál "entrar". */
  async listTenants() {
    return this.prisma.tenant.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }

  /**
   * Permite a SUPERADMIN operar dentro de un tenant ajeno: emite un token nuevo
   * con tenant_id del tenant elegido y rol ADMIN (rol efectivo dentro de ese
   * tenant), sin tocar RolesGuard ni RLS. `impersonating: true` queda en el
   * objeto user devuelto para que el frontend lo muestre y permita volver.
   */
  async impersonate(
    currentUser: { userId: string; email: string; role: string },
    tenantId: string,
  ) {
    if (currentUser.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Solo superadmin puede cambiar de tenant.');
    }
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant no encontrado.');

    const payload = {
      email: currentUser.email,
      sub: currentUser.userId,
      tenant_id: tenant.id,
      role: 'ADMIN',
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: currentUser.userId,
        email: currentUser.email,
        role: 'ADMIN',
        tenantId: tenant.id,
        tenantNombre: tenant.nombre,
        impersonating: true,
      },
    };
  }
}

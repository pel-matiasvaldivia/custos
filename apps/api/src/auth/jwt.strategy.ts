import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getJwtSecret } from '../common/config/jwt.config';
import { PrismaAdminService } from '../prisma/prisma-admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaAdmin: PrismaAdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    // El token puede ser válido (firma/expiración) pero referenciar un tenant_id
    // que ya no existe (p. ej. tras un reset de base de datos). Sin esta
    // verificación, ese caso explota más adelante como un 500 críptico de
    // Prisma (foreign key constraint violated) en cualquier endpoint.
    const tenant = await this.prismaAdmin.tenant.findUnique({
      where: { id: payload.tenant_id },
      select: { id: true },
    });
    if (!tenant) {
      throw new UnauthorizedException(
        'Tu sesión expiró, iniciá sesión de nuevo.',
      );
    }

    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenant_id,
      role: payload.role,
    };
  }
}

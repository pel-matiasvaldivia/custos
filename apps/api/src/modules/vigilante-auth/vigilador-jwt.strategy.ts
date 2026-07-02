import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getJwtSecret } from '../../common/config/jwt.config';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';

/**
 * Estrategia JWT separada para el login móvil de vigiladores (legajo+PIN).
 * Payload distinto del de oficina ({vigiladorId, tenantId, tipo}) — registrada
 * bajo el nombre 'jwt-vigilador' para no colisionar con la estrategia 'jwt'
 * de oficina (JwtStrategy).
 */
@Injectable()
export class VigiladorJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-vigilador',
) {
  constructor(private readonly prismaAdmin: PrismaAdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    // Modo "un celular por objetivo": el token identifica al objetivo, no a un
    // vigilador. Los guardias se identifican por acción (se valida en el service).
    if (payload.tipo === 'DISPOSITIVO') {
      const objetivo = await this.prismaAdmin.objetivo.findFirst({
        where: {
          id: payload.objetivoId,
          tenant_id: payload.tenantId,
          estado: 'ACTIVO',
        },
        select: { id: true },
      });
      if (!objetivo) {
        throw new UnauthorizedException('El objetivo ya no está activo.');
      }
      return {
        objetivoId: payload.objetivoId,
        tenantId: payload.tenantId,
        tipo: 'DISPOSITIVO',
      };
    }

    if (payload.tipo !== 'VIGILADOR') {
      throw new UnauthorizedException('Token inválido');
    }
    const vigilador = await this.prismaAdmin.vigilador.findFirst({
      where: {
        id: payload.vigiladorId,
        tenant_id: payload.tenantId,
        estado: 'ACTIVO',
      },
      select: { id: true },
    });
    if (!vigilador) {
      throw new UnauthorizedException(
        'Tu sesión expiró, iniciá sesión de nuevo.',
      );
    }

    return {
      vigiladorId: payload.vigiladorId,
      tenantId: payload.tenantId,
      tipo: 'VIGILADOR',
    };
  }
}

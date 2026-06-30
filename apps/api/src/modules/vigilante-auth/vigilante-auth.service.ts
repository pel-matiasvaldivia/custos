import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VigilanteAuthService {
  // legajo_nro sólo es único por tenant (@@unique([tenant_id, legajo_nro])), a
  // diferencia del email de oficina que es único global. Por eso buscamos
  // todos los candidatos cross-tenant (cliente admin, omite RLS) y comparamos
  // el PIN contra cada uno hasta encontrar coincidencia.
  constructor(
    private readonly prismaAdmin: PrismaAdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(legajoNro: string, pin: string) {
    const candidatos = await this.prismaAdmin.vigilador.findMany({
      where: { legajo_nro: legajoNro, estado: 'ACTIVO', pin: { not: null } },
      select: {
        id: true,
        tenant_id: true,
        pin: true,
        nombre: true,
        apellido: true,
      },
    });

    for (const candidato of candidatos) {
      const coincide = await bcrypt.compare(pin, candidato.pin as string);
      if (coincide) {
        const payload = {
          vigiladorId: candidato.id,
          tenantId: candidato.tenant_id,
          tipo: 'VIGILADOR',
        };
        return {
          access_token: this.jwtService.sign(payload),
          vigilador: {
            id: candidato.id,
            nombre: candidato.nombre,
            apellido: candidato.apellido,
            tenantId: candidato.tenant_id,
          },
        };
      }
    }

    throw new UnauthorizedException('Legajo o PIN inválidos');
  }
}

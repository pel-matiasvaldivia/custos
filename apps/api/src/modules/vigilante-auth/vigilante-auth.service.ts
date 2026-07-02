import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';
import * as bcrypt from 'bcrypt';
import { LoginDispositivoDto } from './dto/login-dispositivo.dto';

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
        legajo_nro: true,
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
            legajo_nro: candidato.legajo_nro,
            tenantId: candidato.tenant_id,
          },
        };
      }
    }

    throw new UnauthorizedException('Legajo o PIN inválidos');
  }

  /**
   * Login del dispositivo compartido de un objetivo. Emite un token
   * { objetivoId, tenantId, tipo: 'DISPOSITIVO' }. Los vigiladores no se
   * loguean: se identifican por acción desde este dispositivo.
   */
  async loginDispositivo(body: LoginDispositivoDto) {
    let objetivo: {
      id: string;
      tenant_id: string;
      nombre: string;
      direccion: string | null;
      lat: number | null;
      lng: number | null;
      dispositivo_pin: string | null;
    } | null = null;

    if (body.nfc_tag) {
      // El TAG físico es la credencial: no requiere PIN.
      objetivo = await this.prismaAdmin.objetivo.findFirst({
        where: { nfc_tag_id: body.nfc_tag, estado: 'ACTIVO' },
        select: {
          id: true,
          tenant_id: true,
          nombre: true,
          direccion: true,
          lat: true,
          lng: true,
          dispositivo_pin: true,
        },
      });
      if (!objetivo) {
        throw new UnauthorizedException('TAG no reconocido.');
      }
    } else if (body.objetivo_id && body.pin) {
      objetivo = await this.prismaAdmin.objetivo.findFirst({
        where: { id: body.objetivo_id, estado: 'ACTIVO' },
        select: {
          id: true,
          tenant_id: true,
          nombre: true,
          direccion: true,
          lat: true,
          lng: true,
          dispositivo_pin: true,
        },
      });
      if (!objetivo || !objetivo.dispositivo_pin) {
        throw new UnauthorizedException('Objetivo o PIN inválidos.');
      }
      const ok = await bcrypt.compare(body.pin, objetivo.dispositivo_pin);
      if (!ok) throw new UnauthorizedException('Objetivo o PIN inválidos.');
    } else {
      throw new BadRequestException(
        'Escaneá el TAG del objetivo o ingresá ID de objetivo y PIN.',
      );
    }

    const payload = {
      objetivoId: objetivo.id,
      tenantId: objetivo.tenant_id,
      tipo: 'DISPOSITIVO',
    };
    return {
      access_token: this.jwtService.sign(payload),
      objetivo: {
        id: objetivo.id,
        nombre: objetivo.nombre,
        direccion: objetivo.direccion,
        lat: objetivo.lat,
        lng: objetivo.lng,
        tenantId: objetivo.tenant_id,
      },
    };
  }
}

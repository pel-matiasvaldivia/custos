import {
  Controller,
  Get,
  Put,
  Body,
  Request,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarMiTenantDto } from './dto/actualizar-mi-tenant.dto';

/**
 * Endpoints del tenant actual (leídos del JWT). Complementa /system/tenants,
 * que exige UUID en la URL y está pensado para admin cross-tenant.
 * Se expone en /config/tenant para agrupar con el resto de la configuración.
 */
@Controller('config/tenant')
@UseGuards(JwtAuthGuard)
export class MiTenantController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async get(@Request() req: any) {
    return this.prisma.tenant.findUnique({
      where: { id: req.user.tenantId },
      select: {
        id: true,
        nombre: true,
        razon_social: true,
        cuit: true,
        condicion_iva: true,
        direccion: true,
        lat: true,
        lng: true,
        email_contacto: true,
        telefono_contacto: true,
      },
    });
  }

  /** Datos de empresa/facturación (paso final del onboarding). */
  @Put()
  async actualizar(@Request() req: any, @Body() dto: ActualizarMiTenantDto) {
    try {
      return await this.prisma.tenant.update({
        where: { id: req.user.tenantId },
        data: {
          razon_social: dto.razon_social,
          cuit: dto.cuit,
          condicion_iva: dto.condicion_iva,
          direccion: dto.direccion,
          email_contacto: dto.email_contacto,
          telefono_contacto: dto.telefono_contacto,
        },
        select: {
          id: true,
          nombre: true,
          razon_social: true,
          cuit: true,
          condicion_iva: true,
          direccion: true,
          email_contacto: true,
          telefono_contacto: true,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ese CUIT ya está registrado en otra empresa.',
        );
      }
      throw e;
    }
  }

  /** Guarda coordenadas del domicilio. El SOC arranca el mapa centrado ahí. */
  @Put('geo')
  async setGeo(
    @Request() req: any,
    @Body() body: { lat?: number | null; lng?: number | null },
  ) {
    return this.prisma.tenant.update({
      where: { id: req.user.tenantId },
      data: {
        lat: body.lat ?? null,
        lng: body.lng ?? null,
      },
      select: { lat: true, lng: true },
    });
  }
}

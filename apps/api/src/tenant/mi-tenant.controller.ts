import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

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
        direccion: true,
        lat: true,
        lng: true,
        email_contacto: true,
        telefono_contacto: true,
      },
    });
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

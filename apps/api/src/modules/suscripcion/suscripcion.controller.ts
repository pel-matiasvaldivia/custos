import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('suscripcion')
export class SuscripcionController {
  constructor(private readonly suscripcionService: SuscripcionService) {}

  /** Estado del plan del tenant autenticado. */
  @UseGuards(JwtAuthGuard)
  @Get('estado')
  getEstado(@Request() req: any) {
    return this.suscripcionService.getEstado(req.user.tenantId);
  }

  /** Datos de facturación del tenant autenticado. */
  @UseGuards(JwtAuthGuard)
  @Get('facturacion')
  getFacturacion(@Request() req: any) {
    return this.suscripcionService.getDatosFacturacion(req.user.tenantId);
  }

  /** Actualiza los datos de facturación del tenant. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Put('facturacion')
  updateFacturacion(
    @Request() req: any,
    @Body()
    body: {
      razon_social?: string;
      cuit?: string;
      condicion_iva?: string;
      direccion?: string;
      email_contacto?: string;
      telefono_contacto?: string;
    },
  ) {
    return this.suscripcionService.updateDatosFacturacion(req.user.tenantId, body);
  }

  /** Inicia checkout MercadoPago para el plan elegido. */
  @UseGuards(JwtAuthGuard)
  @Post('mp/checkout')
  crearCheckout(
    @Request() req: any,
    @Body() body: { plan: 'mensual' | 'anual'; back_url: string },
  ) {
    return this.suscripcionService.crearCheckoutMP(
      req.user.tenantId,
      body.plan,
      body.back_url,
    );
  }

  /** Webhook IPN de MercadoPago — sin autenticación (lo llama MP). */
  @Post('mp/webhook')
  webhookMP(@Body() body: any) {
    return this.suscripcionService.procesarWebhookMP(body);
  }

  /** SUPERADMIN: activa plan manualmente para demos/soporte. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Post('activar/:tenantId')
  activar(@Param('tenantId') tenantId: string) {
    return this.suscripcionService.activarManual(tenantId);
  }
}

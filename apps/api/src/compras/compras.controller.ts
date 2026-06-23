import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ComprasService } from './compras.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('compras')
@UseGuards(JwtAuthGuard)
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post('solicitudes')
  createSolicitud(@Request() req: any, @Body() data: any) {
    return this.comprasService.createSolicitud(
      req.user.tenantId,
      req.user.userId,
      data,
    );
  }

  @Post('ordenes')
  createOrden(@Request() req: any, @Body() data: any) {
    return this.comprasService.createOrdenCompra(req.user.tenantId, data);
  }

  @Get('ordenes')
  findAll(@Request() req: any) {
    return this.comprasService.findAllOC(req.user.tenantId);
  }

  @Patch('ordenes/:id/recibir')
  recibir(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.comprasService.recibirParcial(
      req.user.tenantId,
      id,
      data.items,
    );
  }

  @Patch('ordenes/:id/pagar')
  pagar(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.comprasService.registrarPago(req.user.tenantId, id, data.monto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ComprasService } from './compras.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { RecibirOrdenDto } from './dto/recibir-orden.dto';
import { PagarOrdenDto } from './dto/pagar-orden.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('compras')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  // Crear solicitud: acción operativa, cualquier rol autenticado puede pedir.
  @Post('solicitudes')
  createSolicitud(@Request() req: any, @Body() data: CreateSolicitudDto) {
    return this.comprasService.createSolicitud(
      req.user.tenantId,
      req.user.userId,
      data,
    );
  }

  // OC y montos: sólo roles con visibilidad financiera.
  @Post('ordenes')
  @Roles('ADMIN', 'GERENCIA', 'COMPRAS')
  createOrden(@Request() req: any, @Body() data: CreateOrdenDto) {
    return this.comprasService.createOrdenCompra(
      req.user.tenantId,
      data,
      req.user.userId,
    );
  }

  @Get('ordenes')
  @Roles('ADMIN', 'GERENCIA', 'COMPRAS')
  findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.comprasService.findAllOC(req.user.tenantId, pagination);
  }

  @Patch('ordenes/:id/recibir')
  @Roles('ADMIN', 'GERENCIA', 'COMPRAS')
  recibir(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: RecibirOrdenDto,
  ) {
    return this.comprasService.recibirParcial(
      req.user.tenantId,
      id,
      data.items,
    );
  }

  @Patch('ordenes/:id/pagar')
  @Roles('ADMIN', 'GERENCIA', 'COMPRAS')
  pagar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: PagarOrdenDto,
  ) {
    return this.comprasService.registrarPago(req.user.tenantId, id, data.monto);
  }
}

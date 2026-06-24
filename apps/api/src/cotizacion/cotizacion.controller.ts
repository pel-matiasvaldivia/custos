import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  // Cotizar es una acción comercial: no la realiza un OPERADOR.
  @Post()
  @Roles('ADMIN', 'GERENCIA')
  create(@Request() req: any, @Body() data: any) {
    return this.cotizacionService.create(req.user.tenantId, data);
  }

  // Lectura abierta; el service recorta montos para OPERADOR.
  @Get()
  findAll(@Request() req: any) {
    return this.cotizacionService.findAll(req.user.tenantId, req.user.role);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cotizacionService.findOne(id, req.user.tenantId, req.user.role);
  }
}

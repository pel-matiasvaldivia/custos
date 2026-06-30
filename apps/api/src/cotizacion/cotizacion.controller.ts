import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { CambiarEstadoCotizacionDto } from './dto/cambiar-estado-cotizacion.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  // Cotizar es una acción comercial: no la realiza un OPERADOR.
  @Post()
  @Roles('ADMIN', 'GERENCIA')
  create(@Request() req: any, @Body() data: CreateCotizacionDto) {
    return this.cotizacionService.create(req.user.tenantId, data);
  }

  // Lectura abierta; el service recorta montos para OPERADOR.
  @Get()
  findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.cotizacionService.findAll(req.user.tenantId, req.user.role, pagination);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cotizacionService.findOne(id, req.user.tenantId, req.user.role);
  }

  // Igual que crear: cambiar el estado comercial de una cotización no es
  // una acción de OPERADOR.
  @Patch(':id/estado')
  @Roles('ADMIN', 'GERENCIA')
  cambiarEstado(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: CambiarEstadoCotizacionDto,
  ) {
    return this.cotizacionService.cambiarEstado(id, req.user.tenantId, body.estado);
  }
}

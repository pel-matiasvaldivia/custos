import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ObjetivoService } from './objetivo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
import { UpdateObjetivoDto } from './dto/update-objetivo.dto';
import { AsignarVehiculoDto } from './dto/asignar-vehiculo.dto';
import { FindObjetivosDto } from './dto/find-objetivos.dto';

@Controller('objetivos')
@UseGuards(JwtAuthGuard)
export class ObjetivoController {
  constructor(private readonly objetivoService: ObjetivoService) {}

  @Get()
  async findAll(@Request() req: any, @Query() query: FindObjetivosDto) {
    return this.objetivoService.findAll(
      req.user.tenantId,
      query,
      query.clienteId,
    );
  }

  @Get(':id')
  async findDetalle(@Param('id') id: string, @Request() req: any) {
    return this.objetivoService.findDetalle(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: CreateObjetivoDto, @Request() req: any) {
    return this.objetivoService.create({
      ...body,
      tenant_id: req.user.tenantId,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateObjetivoDto,
    @Request() req: any,
  ) {
    return this.objetivoService.update(id, req.user.tenantId, body);
  }

  @Post(':id/vehiculos')
  async asignarVehiculo(
    @Param('id') id: string,
    @Body() body: AsignarVehiculoDto,
    @Request() req: any,
  ) {
    return this.objetivoService.asignarVehiculo(
      id,
      req.user.tenantId,
      body.vehiculo_id,
    );
  }

  @Delete(':id/vehiculos/:asignacionId')
  async liberarVehiculo(
    @Param('id') id: string,
    @Param('asignacionId') asignacionId: string,
    @Request() req: any,
  ) {
    return this.objetivoService.liberarVehiculo(
      id,
      req.user.tenantId,
      asignacionId,
    );
  }

  @Post(':id/notificar-personal-insuficiente')
  async notificarPersonalInsuficiente(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.objetivoService.notificarPersonalInsuficiente(
      id,
      req.user.tenantId,
    );
  }
}

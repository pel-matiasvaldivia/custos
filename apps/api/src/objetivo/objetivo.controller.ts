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
import { ConfigurarDispositivoDto } from './dto/configurar-dispositivo.dto';

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

  /** Geoposición del objetivo (lat/lng del domicilio) + área de cobertura. */
  @Put(':id/geo')
  async setGeo(
    @Param('id') id: string,
    @Body()
    body: {
      lat?: number | null;
      lng?: number | null;
      area_cobertura?: Array<{ lat: number; lng: number }> | null;
    },
    @Request() req: any,
  ) {
    return this.objetivoService.setGeo(id, req.user.tenantId, body);
  }

  /** Estado de las credenciales del dispositivo compartido del objetivo. */
  @Get(':id/dispositivo')
  async estadoDispositivo(@Param('id') id: string, @Request() req: any) {
    return this.objetivoService.estadoDispositivo(id, req.user.tenantId);
  }

  /** Configura PIN y/o TAG NFC del dispositivo compartido del objetivo. */
  @Post(':id/dispositivo')
  async configurarDispositivo(
    @Param('id') id: string,
    @Body() body: ConfigurarDispositivoDto,
    @Request() req: any,
  ) {
    return this.objetivoService.configurarDispositivo(
      id,
      req.user.tenantId,
      body,
    );
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

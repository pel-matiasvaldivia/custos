import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('vehiculos')
@UseGuards(JwtAuthGuard)
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Get()
  async findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.vehiculoService.findAll(req.user.tenantId, pagination);
  }

  @Get('disponibles')
  async findDisponibles(@Request() req: any) {
    return this.vehiculoService.findDisponibles(req.user.tenantId);
  }

  @Post()
  async create(@Body() body: CreateVehiculoDto, @Request() req: any) {
    return this.vehiculoService.create({
      ...body,
      tenant_id: req.user.tenantId,
    });
  }
}

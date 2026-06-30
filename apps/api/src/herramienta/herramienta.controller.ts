import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HerramientaService } from './herramienta.service';
import { CreateHerramientaDto } from './dto/create-herramienta.dto';
import { AsignarHerramientaDto } from './dto/asignar-herramienta.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('herramientas')
@UseGuards(JwtAuthGuard)
export class HerramientaController {
  constructor(private readonly herramientaService: HerramientaService) {}

  @Get()
  async findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.herramientaService.findAll(req.user.tenantId, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.herramientaService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: CreateHerramientaDto, @Request() req: any) {
    return this.herramientaService.create({
      ...body,
      tenant_id: req.user.tenantId,
    });
  }

  @Post(':id/asignar')
  async asignar(
    @Param('id') id: string,
    @Body() body: AsignarHerramientaDto,
    @Request() req: any,
  ) {
    return this.herramientaService.asignar(
      id,
      req.user.tenantId,
      body.vigilador_id,
      body.observaciones,
    );
  }

  @Post(':id/devolver')
  async devolver(@Param('id') id: string, @Request() req: any) {
    return this.herramientaService.devolver(id, req.user.tenantId);
  }
}

import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';

@Controller('contratos')
@UseGuards(JwtAuthGuard)
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  @Get()
  async findAll(
    @Query('objetivoId') objetivoId: string,
    @Query('clienteId') clienteId: string,
    @Request() req: any,
  ) {
    if (clienteId) return this.contratoService.findByCliente(clienteId, req.user.tenantId);
    return this.contratoService.findByObjetivo(objetivoId, req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.contratoService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: CreateContratoDto, @Request() req: any) {
    return this.contratoService.create(req.user.tenantId, body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateContratoDto, @Request() req: any) {
    return this.contratoService.update(id, req.user.tenantId, body);
  }
}

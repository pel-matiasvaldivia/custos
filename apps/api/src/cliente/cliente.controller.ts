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
import { ClienteService } from './cliente.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { FindClientesDto } from './dto/find-clientes.dto';

@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  async findAll(@Request() req: any, @Query() query: FindClientesDto) {
    return this.clienteService.findAll(
      req.user.tenantId,
      query,
      query.busqueda,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.clienteService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: CreateClienteDto, @Request() req: any) {
    return this.clienteService.create(req.user.tenantId, body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateClienteDto,
    @Request() req: any,
  ) {
    return this.clienteService.update(id, req.user.tenantId, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.clienteService.delete(id, req.user.tenantId);
    return { ok: true };
  }
}

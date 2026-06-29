import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePuestoDto } from './dto/create-puesto.dto';
import { UpdatePuestoDto } from './dto/update-puesto.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('puestos')
@UseGuards(JwtAuthGuard)
export class PuestoController {
  constructor(private readonly puestoService: PuestoService) {}

  @Get()
  async findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.puestoService.findAll(req.user.tenantId, pagination);
  }

  @Post()
  async create(@Body() body: CreatePuestoDto, @Request() req: any) {
    return this.puestoService.create({
      ...body,
      tenant_id: req.user.tenantId,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePuestoDto,
    @Request() req: any,
  ) {
    return this.puestoService.update(id, req.user.tenantId, body);
  }
}

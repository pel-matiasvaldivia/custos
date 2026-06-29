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
import { VigilanteService } from './vigilante.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVigilanteDto } from './dto/create-vigilante.dto';
import { UpdateVigilanteDto } from './dto/update-vigilante.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('vigilantes')
@UseGuards(JwtAuthGuard)
export class VigilanteController {
  constructor(private readonly vigilanteService: VigilanteService) {}

  @Get()
  async findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.vigilanteService.findAll(req.user.tenantId, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.vigilanteService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: CreateVigilanteDto, @Request() req: any) {
    return this.vigilanteService.create({
      ...body,
      tenant_id: req.user.tenantId,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateVigilanteDto,
    @Request() req: any,
  ) {
    return this.vigilanteService.update(id, req.user.tenantId, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.vigilanteService.delete(id, req.user.tenantId);
  }
}

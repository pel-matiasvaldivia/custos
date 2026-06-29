import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NovedadService } from './novedad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('novedades')
@UseGuards(JwtAuthGuard)
export class NovedadController {
  constructor(private readonly novedadService: NovedadService) {}

  @Post()
  create(@Request() req: any, @Body() body: CreateNovedadDto) {
    return this.novedadService.create(req.user.tenantId, body);
  }

  @Get()
  findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.novedadService.findAll(req.user.tenantId, pagination);
  }

  @Get('puesto/:id')
  findByPuesto(@Request() req: any, @Param('id') id: string) {
    return this.novedadService.findByPuesto(req.user.tenantId, id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { NovedadService } from './novedad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { FiltrarNovedadesDto } from './dto/filtrar-novedades.dto';

@Controller('novedades')
@UseGuards(JwtAuthGuard)
export class NovedadController {
  constructor(private readonly novedadService: NovedadService) {}

  @Post()
  create(@Request() req: any, @Body() body: CreateNovedadDto) {
    return this.novedadService.create(req.user.tenantId, body);
  }

  @Get()
  findAll(@Request() req: any, @Query() filtros: FiltrarNovedadesDto) {
    return this.novedadService.findAll(req.user.tenantId, filtros);
  }

  @Get('reporte/pdf')
  async reportePdf(
    @Request() req: any,
    @Query() filtros: FiltrarNovedadesDto,
    @Res() res: Response,
  ) {
    const doc = await this.novedadService.generarReportePdf(
      req.user.tenantId,
      filtros,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-novedades.pdf',
    );
    doc.pipe(res);
    doc.end();
  }

  @Get('puesto/:id')
  findByPuesto(@Request() req: any, @Param('id') id: string) {
    return this.novedadService.findByPuesto(req.user.tenantId, id);
  }
}

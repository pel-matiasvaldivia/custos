import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
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
    const buffer = await this.novedadService.generarReportePdf(
      req.user.tenantId,
      filtros,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-novedades.pdf',
    );
    res.send(buffer);
  }

  @Get('puesto/:id')
  findByPuesto(@Request() req: any, @Param('id') id: string) {
    return this.novedadService.findByPuesto(req.user.tenantId, id);
  }

  /** Sirve la foto/audio adjunto de una novedad (streaming desde MinIO). */
  @Get(':id/adjuntos/:indice')
  async adjunto(
    @Request() req: any,
    @Param('id') id: string,
    @Param('indice', ParseIntPipe) indice: number,
    @Res() res: Response,
  ) {
    const { stream, contentType } = await this.novedadService.obtenerAdjunto(
      req.user.tenantId,
      id,
      indice,
    );
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, max-age=3600');
    stream.pipe(res);
  }
}

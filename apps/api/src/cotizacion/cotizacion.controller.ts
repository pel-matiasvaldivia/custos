import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CotizacionService } from './cotizacion.service';
import { CotizacionPdfService } from './cotizacion-pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { CambiarEstadoCotizacionDto } from './dto/cambiar-estado-cotizacion.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CotizacionController {
  constructor(
    private readonly cotizacionService: CotizacionService,
    private readonly cotizacionPdfService: CotizacionPdfService,
  ) {}

  // Cotizar es una acción comercial: no la realiza un OPERADOR.
  @Post()
  @Roles('ADMIN', 'GERENCIA')
  create(@Request() req: any, @Body() data: CreateCotizacionDto) {
    return this.cotizacionService.create(req.user.tenantId, data);
  }

  // Lectura abierta; el service recorta montos para OPERADOR.
  @Get()
  findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.cotizacionService.findAll(
      req.user.tenantId,
      req.user.role,
      pagination,
    );
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cotizacionService.findOne(id, req.user.tenantId, req.user.role);
  }

  // Igual que crear: cambiar el estado comercial de una cotización no es
  // una acción de OPERADOR.
  @Patch(':id/estado')
  @Roles('ADMIN', 'GERENCIA')
  cambiarEstado(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: CambiarEstadoCotizacionDto,
  ) {
    return this.cotizacionService.cambiarEstado(
      id,
      req.user.tenantId,
      body.estado,
    );
  }

  @Get(':id/documento-html')
  @Roles('ADMIN', 'GERENCIA')
  async documentoHtml(@Request() req: any, @Param('id') id: string) {
    const html = await this.cotizacionPdfService.buildHtml(id, req.user.tenantId);
    return { html };
  }

  @Post(':id/documento')
  @Roles('ADMIN', 'GERENCIA')
  async generarDocumento(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { html: string },
    @Res() res: Response,
  ) {
    const buffer = await this.cotizacionPdfService.generarYGuardarPdf(
      id,
      req.user.tenantId,
      body.html,
    );
    const cotId = `COT-${id.slice(0, 8).toUpperCase()}`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${cotId}.pdf`);
    res.send(buffer);
  }

  @Get(':id/versiones')
  @Roles('ADMIN', 'GERENCIA')
  async versiones(@Request() req: any, @Param('id') id: string) {
    return this.cotizacionPdfService.findVersiones(id, req.user.tenantId);
  }

  @Get(':id/versiones/:version/documento')
  @Roles('ADMIN', 'GERENCIA')
  async descargarVersion(
    @Request() req: any,
    @Param('id') id: string,
    @Param('version') version: string,
    @Res() res: Response,
  ) {
    const rows = await this.cotizacionPdfService.findVersiones(id, req.user.tenantId);
    const entry = rows.find((r) => r.version === parseInt(version, 10));
    if (!entry) {
      res.status(404).json({ message: 'Versión no encontrada.' });
      return;
    }
    const { stream, contentType } =
      await this.cotizacionPdfService.descargarDocumentoGuardado(entry.documento_key);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=cotizacion-v${version}.pdf`);
    stream.pipe(res);
  }
}

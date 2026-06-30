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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ContratoService } from './contrato.service';
import { ContratoPdfService } from './contrato-pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { GenerarDocumentoDto } from './dto/generar-documento.dto';

@Controller('contratos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContratoController {
  constructor(
    private readonly contratoService: ContratoService,
    private readonly contratoPdfService: ContratoPdfService,
  ) {}

  @Get()
  async findAll(
    @Query('objetivoId') objetivoId: string,
    @Query('clienteId') clienteId: string,
    @Request() req: any,
  ) {
    if (clienteId)
      return this.contratoService.findByCliente(clienteId, req.user.tenantId);
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
  async update(
    @Param('id') id: string,
    @Body() body: UpdateContratoDto,
    @Request() req: any,
  ) {
    return this.contratoService.update(id, req.user.tenantId, body);
  }

  // Genera el HTML del contrato (plantilla + datos del contrato + firma del
  // Director) para que el usuario lo revise/edite antes de convertirlo a PDF.
  @Get(':id/documento-html')
  @Roles('ADMIN', 'GERENCIA')
  async documentoHtml(@Param('id') id: string, @Request() req: any) {
    const html = await this.contratoPdfService.mergeHtml(id, req.user.tenantId);
    return { html };
  }

  // Recibe el HTML ya editado/confirmado, genera el PDF firmado y lo guarda
  // como el documento oficial del contrato.
  @Post(':id/documento')
  @Roles('ADMIN', 'GERENCIA')
  async generarDocumento(
    @Param('id') id: string,
    @Body() body: GenerarDocumentoDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const buffer = await this.contratoPdfService.generarYGuardarPdf(
      id,
      req.user.tenantId,
      body.html,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contrato.pdf`);
    res.send(buffer);
  }

  // Re-descarga el último documento generado (sin volver a renderizar).
  @Get(':id/documento')
  async descargarDocumento(
    @Param('id') id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const contrato = await this.contratoService.findOne(id, req.user.tenantId);
    if (!contrato?.documento_key) {
      res.status(404).json({
        message: 'Este contrato todavía no tiene un documento generado.',
      });
      return;
    }
    const { stream, contentType } =
      await this.contratoPdfService.descargarDocumentoGuardado(
        contrato.documento_key,
      );
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=contrato.pdf`);
    stream.pipe(res);
  }
}

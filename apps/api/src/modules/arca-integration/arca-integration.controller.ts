import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { NominaService } from './services/nomina.service';
import { ArcaConfigService } from './services/arca-config.service';
import { FacturacionService } from './services/facturacion.service';
import { FacturaPdfService } from './services/factura-pdf.service';
import { GuardarConfiguracionArcaDto } from './dto/configuracion-arca.dto';
import { FacturarDto } from './dto/facturar.dto';

@Controller('arca-integration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArcaIntegrationController {
  constructor(
    private readonly nomina: NominaService,
    private readonly config: ArcaConfigService,
    private readonly facturacion: FacturacionService,
    private readonly facturaPdf: FacturaPdfService,
  ) {}

  // ─── Personal (nómina / LSD) ───────────────────────────────────────────────
  @Post('importar-nomina')
  @Roles('ADMIN', 'GERENCIA')
  @UseInterceptors(FileInterceptor('archivo'))
  async importarNomina(
    @Request() req: any,
    @UploadedFile() archivo: Express.Multer.File | undefined,
  ) {
    if (!archivo) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }
    return this.nomina.importarNomina(
      req.user.tenantId,
      archivo.buffer,
      archivo.originalname ?? '',
    );
  }

  @Get('exportar-altas-txt')
  @Roles('ADMIN', 'GERENCIA')
  async exportarAltas(
    @Request() req: any,
    @Query('ids') ids: string,
    @Res() res: Response,
  ) {
    const lista = (ids ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const contenido = await this.nomina.exportarAltasTxt(
      req.user.tenantId,
      lista,
    );
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=altas_arca.txt');
    res.send(contenido);
  }

  @Get('exportar-lsd-txt')
  @Roles('ADMIN', 'GERENCIA')
  async exportarLsd(
    @Request() req: any,
    @Query('liquidacionId') liquidacionId: string,
    @Res() res: Response,
  ) {
    if (!liquidacionId) {
      throw new BadRequestException('Falta el parámetro liquidacionId.');
    }
    const contenido = await this.nomina.exportarLsdTxt(
      req.user.tenantId,
      liquidacionId,
    );
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=lsd.txt');
    res.send(contenido);
  }

  // ─── Configuración ARCA ────────────────────────────────────────────────────
  @Get('configuracion')
  @Roles('ADMIN', 'GERENCIA')
  obtenerConfig(@Request() req: any) {
    return this.config.obtenerParaVista(req.user.tenantId);
  }

  @Put('configuracion')
  @Roles('ADMIN', 'GERENCIA')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certificado', maxCount: 1 },
      { name: 'clave', maxCount: 1 },
    ]),
  )
  guardarConfig(
    @Request() req: any,
    @Body() dto: GuardarConfiguracionArcaDto,
    @UploadedFiles()
    files: {
      certificado?: Express.Multer.File[];
      clave?: Express.Multer.File[];
    },
  ) {
    return this.config.guardar(
      req.user.tenantId,
      dto,
      files?.certificado?.[0],
      files?.clave?.[0],
    );
  }

  @Post('probar-conexion')
  @Roles('ADMIN', 'GERENCIA')
  probarConexion(@Request() req: any) {
    return this.facturacion.probarConexion(req.user.tenantId);
  }

  // ─── Facturación electrónica ───────────────────────────────────────────────
  @Post('facturar')
  @Roles('ADMIN', 'GERENCIA')
  facturar(@Request() req: any, @Body() dto: FacturarDto) {
    return this.facturacion.facturar(req.user.tenantId, dto);
  }

  @Get('facturas')
  @Roles('ADMIN', 'GERENCIA')
  listarFacturas(@Request() req: any) {
    return this.facturacion.listar(req.user.tenantId);
  }

  @Get('facturas/:id/pdf')
  @Roles('ADMIN', 'GERENCIA')
  async descargarPdf(
    @Request() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.facturaPdf.generar(id, req.user.tenantId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=comprobante-${id.slice(0, 8)}.pdf`,
    );
    res.send(buffer);
  }
}

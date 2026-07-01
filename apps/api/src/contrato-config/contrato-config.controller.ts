import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Post,
  Param,
  Res,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ContratoConfigService } from './contrato-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdatePlantillaContratoDto } from './dto/update-plantilla-contrato.dto';
import { ActualizarFirmaDto } from './dto/actualizar-firma.dto';

const TIPOS_FIRMA_PERMITIDOS = ['image/png', 'image/jpeg'];
const TAMANO_MAXIMO_FIRMA_BYTES = 2 * 1024 * 1024; // 2 MB

@Controller('config/contrato')
export class ContratoConfigController {
  constructor(private readonly contratoConfigService: ContratoConfigService) {}

  /** Proxy público — los navegadores no pueden enviar Authorization en <img src>. */
  @Get('tenants/:tenantId/logo')
  async servirLogo(@Param('tenantId') tenantId: string, @Res() res: Response) {
    const { stream, contentType } =
      await this.contratoConfigService.servirLogo(tenantId);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    stream.pipe(res);
  }

  @Get('tenants/:tenantId/firma')
  async servirFirma(@Param('tenantId') tenantId: string, @Res() res: Response) {
    const { stream, contentType } =
      await this.contratoConfigService.servirFirma(tenantId);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    stream.pipe(res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findOne(@Request() req: any) {
    return this.contratoConfigService.findOne(req.user.tenantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  @Roles('ADMIN', 'GERENCIA')
  updatePlantilla(
    @Request() req: any,
    @Body() dto: UpdatePlantillaContratoDto,
  ) {
    return this.contratoConfigService.updatePlantilla(
      req.user.tenantId,
      dto.plantilla_html,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('firma')
  @Roles('ADMIN', 'GERENCIA')
  @UseInterceptors(FileInterceptor('file'))
  async actualizarFirma(
    @Request() req: any,
    @Body() dto: ActualizarFirmaDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen de firma.');
    }
    if (!TIPOS_FIRMA_PERMITIDOS.includes(file.mimetype)) {
      throw new BadRequestException('La firma debe ser una imagen PNG o JPG.');
    }
    if (file.size > TAMANO_MAXIMO_FIRMA_BYTES) {
      throw new BadRequestException(
        'La imagen de firma supera el tamaño máximo de 2 MB.',
      );
    }
    return this.contratoConfigService.actualizarFirma(
      req.user.tenantId,
      file,
      dto.nombre,
      dto.cargo,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logo')
  @Roles('ADMIN', 'GERENCIA')
  @UseInterceptors(FileInterceptor('file'))
  async actualizarLogo(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen de logo.');
    }
    if (!TIPOS_FIRMA_PERMITIDOS.includes(file.mimetype)) {
      throw new BadRequestException('El logo debe ser una imagen PNG o JPG.');
    }
    if (file.size > TAMANO_MAXIMO_FIRMA_BYTES) {
      throw new BadRequestException('El logo supera el tamaño máximo de 2 MB.');
    }
    return this.contratoConfigService.actualizarLogo(req.user.tenantId, file);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CredencialService } from './credencial.service';
import { CreateCredencialDto } from './dto/create-credencial.dto';
import { StorageService } from '../storage/storage.service';
import { VigilanteService } from '../vigilante/vigilante.service';

const TIPOS_DOCUMENTO_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf'];

@Controller('vigilantes/:vigiladorId/credenciales')
@UseGuards(JwtAuthGuard)
export class CredencialController {
  constructor(
    private readonly credencialService: CredencialService,
    private readonly storageService: StorageService,
    private readonly vigilanteService: VigilanteService,
  ) {}

  @Get()
  async findAll(@Param('vigiladorId') vigiladorId: string, @Request() req: any) {
    return this.credencialService.findByVigilador(vigiladorId, req.user.tenantId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('vigiladorId') vigiladorId: string,
    @Body() body: CreateCredencialDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Request() req: any,
  ) {
    let documentoUrl: string | undefined;
    let documentoKey: string | undefined;
    if (file) {
      if (!TIPOS_DOCUMENTO_PERMITIDOS.includes(file.mimetype)) {
        throw new BadRequestException(
          'El documento debe ser una imagen JPG/PNG o un PDF.',
        );
      }
      const subida = await this.storageService.subir(
        file.buffer,
        file.originalname,
        file.mimetype,
        'credenciales',
      );
      documentoUrl = subida.url;
      documentoKey = subida.key;
    }

    const credencial = await this.credencialService.create({
      ...body,
      vigilador_id: vigiladorId,
      tenant_id: req.user.tenantId,
      documento_url: documentoUrl,
      documento_key: documentoKey,
    });
    await this.vigilanteService.recalcularCompletitud(vigiladorId, req.user.tenantId);
    return credencial;
  }

  @Get(':id/documento')
  async descargarDocumento(
    @Param('id') id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const credencial = await this.credencialService.findOne(id, req.user.tenantId);
    if (!credencial.documento_key) {
      throw new BadRequestException('Esta credencial no tiene un documento adjunto.');
    }
    const { stream, contentType } = await this.storageService.descargar(credencial.documento_key);
    res.setHeader('Content-Type', contentType);
    stream.pipe(res);
  }
}

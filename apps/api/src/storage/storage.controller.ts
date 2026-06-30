import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StorageService } from './storage.service';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf'];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se aceptan imágenes JPG/PNG o PDF.',
      );
    }
    if (file.size > TAMANO_MAXIMO_BYTES) {
      throw new BadRequestException('El archivo supera el tamaño máximo de 5 MB.');
    }

    return this.storageService.subir(file.buffer, file.originalname, file.mimetype, 'documentos');
  }
}

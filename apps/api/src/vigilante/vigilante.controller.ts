import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { VigilanteService } from './vigilante.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateVigilanteDto } from './dto/create-vigilante.dto';
import { UpdateVigilanteDto } from './dto/update-vigilante.dto';
import { SetPinDto } from './dto/set-pin.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { StorageService } from '../storage/storage.service';
import { HerramientaService } from '../herramienta/herramienta.service';

const TIPOS_FOTO_PERMITIDOS = ['image/jpeg', 'image/png'];

@Controller('vigilantes')
@UseGuards(JwtAuthGuard)
export class VigilanteController {
  constructor(
    private readonly vigilanteService: VigilanteService,
    private readonly storageService: StorageService,
    private readonly herramientaService: HerramientaService,
  ) {}

  @Get()
  async findAll(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.vigilanteService.findAll(req.user.tenantId, pagination);
  }

  @Get('plantilla')
  async descargarPlantilla(@Res() res: Response) {
    const buffer = await this.vigilanteService.generarPlantilla();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="plantilla_vigiladores.xlsx"',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @Post('importar')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'GERENCIA')
  @UseInterceptors(FileInterceptor('file'))
  async importarMasivo(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo.');
    return this.vigilanteService.importarMasivo(req.user.tenantId, file.buffer);
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

  @Post(':id/foto')
  @UseInterceptors(FileInterceptor('file'))
  async subirFoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }
    if (!TIPOS_FOTO_PERMITIDOS.includes(file.mimetype)) {
      throw new BadRequestException('La foto debe ser una imagen JPG o PNG.');
    }
    const { url } = await this.storageService.subir(
      file.buffer,
      file.originalname,
      file.mimetype,
      'vigiladores/fotos',
    );
    return this.vigilanteService.setFoto(id, req.user.tenantId, url);
  }

  @Get(':id/completitud')
  async completitud(@Param('id') id: string, @Request() req: any) {
    return this.vigilanteService.getCompletitud(id, req.user.tenantId);
  }

  @Get(':id/herramientas')
  async herramientas(@Param('id') id: string, @Request() req: any) {
    return this.herramientaService.findHerramientasDeVigilador(
      id,
      req.user.tenantId,
    );
  }

  @Post(':id/pin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async setPin(
    @Param('id') id: string,
    @Body() body: SetPinDto,
    @Request() req: any,
  ) {
    return this.vigilanteService.setPin(id, req.user.tenantId, body.pin);
  }
}

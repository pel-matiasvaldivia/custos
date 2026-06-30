import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { PLANTILLA_CONTRATO_DEFAULT } from './plantilla-contrato.default';

@Injectable()
export class ContratoConfigService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async findOne(tenantId: string) {
    let config = await this.prisma.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });

    if (!config) {
      config = await this.prisma.configuracionContrato.create({
        data: {
          tenant_id: tenantId,
          plantilla_html: PLANTILLA_CONTRATO_DEFAULT,
        },
      });
    }

    const firma_url = config.firma_key
      ? await this.storageService.obtenerUrlFirmada(config.firma_key)
      : null;

    return { ...config, firma_url };
  }

  async updatePlantilla(tenantId: string, plantillaHtml: string) {
    return this.prisma.configuracionContrato.upsert({
      where: { tenant_id: tenantId },
      update: { plantilla_html: plantillaHtml },
      create: { tenant_id: tenantId, plantilla_html: plantillaHtml },
    });
  }

  async actualizarFirma(
    tenantId: string,
    file: Express.Multer.File,
    nombre?: string,
    cargo?: string,
  ) {
    const existente = await this.prisma.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });

    const subida = await this.storageService.subir(
      file.buffer,
      file.originalname,
      file.mimetype,
      'firmas',
    );

    const actualizado = await this.prisma.configuracionContrato.upsert({
      where: { tenant_id: tenantId },
      update: {
        firma_key: subida.key,
        firma_nombre: nombre ?? existente?.firma_nombre,
        firma_cargo: cargo ?? existente?.firma_cargo,
      },
      create: {
        tenant_id: tenantId,
        plantilla_html: PLANTILLA_CONTRATO_DEFAULT,
        firma_key: subida.key,
        firma_nombre: nombre,
        firma_cargo: cargo,
      },
    });

    if (existente?.firma_key && existente.firma_key !== subida.key) {
      await this.storageService
        .eliminar(existente.firma_key)
        .catch(() => undefined);
    }

    const firma_url = await this.storageService.obtenerUrlFirmada(
      actualizado.firma_key!,
    );
    return { ...actualizado, firma_url };
  }
}

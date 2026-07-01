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

    // logo_key is a new column — read via queryRaw to avoid Prisma client type mismatch
    const logoRows = await this.prisma.$queryRaw<{ logo_key: string | null }[]>`
      SELECT logo_key FROM configuraciones_contrato WHERE tenant_id = ${tenantId}::uuid LIMIT 1
    `;
    const logo_key = logoRows[0]?.logo_key ?? null;
    const logo_url = logo_key
      ? await this.storageService.obtenerUrlFirmada(logo_key)
      : null;

    return { ...config, firma_url, logo_key, logo_url };
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

  async actualizarLogo(tenantId: string, file: Express.Multer.File) {
    // Get existing logo_key via queryRaw (new column)
    const rows = await this.prisma.$queryRaw<{ logo_key: string | null }[]>`
      SELECT logo_key FROM configuraciones_contrato WHERE tenant_id = ${tenantId}::uuid LIMIT 1
    `;
    const existenteLogo = rows[0]?.logo_key ?? null;

    const subida = await this.storageService.subir(
      file.buffer,
      file.originalname,
      file.mimetype,
      'logos',
    );

    await this.prisma.$executeRaw`
      UPDATE configuraciones_contrato SET logo_key = ${subida.key} WHERE tenant_id = ${tenantId}::uuid
    `;

    if (existenteLogo && existenteLogo !== subida.key) {
      await this.storageService.eliminar(existenteLogo).catch(() => undefined);
    }

    const logo_url = await this.storageService.obtenerUrlFirmada(subida.key);
    return { logo_key: subida.key, logo_url };
  }
}

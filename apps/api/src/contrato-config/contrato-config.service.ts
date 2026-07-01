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

    // Use proxy URLs (/api/v1/config/contrato/tenants/:id/...) so the browser
    // doesn't try to reach the internal MinIO host directly via a presigned URL.
    const firma_url = config.firma_key
      ? `/api/v1/config/contrato/tenants/${tenantId}/firma?v=${config.firma_key.slice(-8)}`
      : null;

    // logo_key is a new column — read via queryRaw to avoid Prisma client type mismatch
    const logoRows = await this.prisma.$queryRaw<{ logo_key: string | null }[]>`
      SELECT logo_key FROM configuraciones_contrato WHERE tenant_id = ${tenantId}::uuid LIMIT 1
    `;
    const logo_key = logoRows[0]?.logo_key ?? null;
    const logo_url = logo_key
      ? `/api/v1/config/contrato/tenants/${tenantId}/logo?v=${logo_key.slice(-8)}`
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

    const firma_url = `/api/v1/config/contrato/tenants/${tenantId}/firma?v=${actualizado.firma_key!.slice(-8)}`;
    return { ...actualizado, firma_url };
  }

  async servirLogo(tenantId: string) {
    const rows = await this.prisma.$queryRaw<{ logo_key: string | null }[]>`
      SELECT logo_key FROM configuraciones_contrato WHERE tenant_id = ${tenantId}::uuid LIMIT 1
    `;
    const key = rows[0]?.logo_key;
    if (!key) throw new Error('Sin logo');
    return this.storageService.descargar(key);
  }

  async servirFirma(tenantId: string) {
    const config = await this.prisma.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });
    if (!config?.firma_key) throw new Error('Sin firma');
    return this.storageService.descargar(config.firma_key);
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

    const logo_url = `/api/v1/config/contrato/tenants/${tenantId}/logo?v=${subida.key.slice(-8)}`;
    return { logo_key: subida.key, logo_url };
  }
}

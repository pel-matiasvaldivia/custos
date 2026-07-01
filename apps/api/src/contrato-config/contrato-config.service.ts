import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaAdminService } from '../prisma/prisma-admin.service';
import { StorageService } from '../storage/storage.service';
import { PLANTILLA_CONTRATO_DEFAULT } from './plantilla-contrato.default';

/**
 * Usa PrismaAdminService (bypassa RLS) porque:
 *  - Las rutas proxy de logo/firma son públicas (sin JWT), sin contexto de tenant.
 *  - El aislamiento multi-tenant se mantiene por código: cada operación filtra por
 *    tenant_id explícitamente, tal como indica el comentario de PrismaAdminService.
 */
@Injectable()
export class ContratoConfigService {
  constructor(
    private prismaAdmin: PrismaAdminService,
    private storageService: StorageService,
  ) {}

  async findOne(tenantId: string) {
    let config = await this.prismaAdmin.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });

    if (!config) {
      config = await this.prismaAdmin.configuracionContrato.create({
        data: {
          tenant_id: tenantId,
          plantilla_html: PLANTILLA_CONTRATO_DEFAULT,
        },
      });
    }

    const firma_url = config.firma_key
      ? `/api/v1/config/contrato/tenants/${tenantId}/firma?v=${config.firma_key.slice(-8)}`
      : null;

    const logo_key = (config as any).logo_key as string | null ?? null;
    const logo_url = logo_key
      ? `/api/v1/config/contrato/tenants/${tenantId}/logo?v=${logo_key.slice(-8)}`
      : null;

    return { ...config, firma_url, logo_key, logo_url };
  }

  async updatePlantilla(tenantId: string, plantillaHtml: string) {
    return this.prismaAdmin.configuracionContrato.upsert({
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
    const existente = await this.prismaAdmin.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });

    const subida = await this.storageService.subir(
      file.buffer,
      file.originalname,
      file.mimetype,
      'firmas',
    );

    const actualizado = await this.prismaAdmin.configuracionContrato.upsert({
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
    const config = await this.prismaAdmin.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });
    const key = (config as any)?.logo_key as string | null | undefined;
    if (!key) throw new NotFoundException('Sin logo');
    return this.storageService.descargar(key);
  }

  async servirFirma(tenantId: string) {
    const config = await this.prismaAdmin.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });
    if (!config?.firma_key) throw new NotFoundException('Sin firma');
    return this.storageService.descargar(config.firma_key);
  }

  async actualizarLogo(tenantId: string, file: Express.Multer.File) {
    const existente = await this.prismaAdmin.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });
    const existenteLogo = (existente as any)?.logo_key as string | null ?? null;

    const subida = await this.storageService.subir(
      file.buffer,
      file.originalname,
      file.mimetype,
      'logos',
    );

    await this.prismaAdmin.configuracionContrato.upsert({
      where: { tenant_id: tenantId },
      update: { logo_key: subida.key } as any,
      create: {
        tenant_id: tenantId,
        plantilla_html: PLANTILLA_CONTRATO_DEFAULT,
        logo_key: subida.key,
      } as any,
    });

    if (existenteLogo && existenteLogo !== subida.key) {
      await this.storageService.eliminar(existenteLogo).catch(() => undefined);
    }

    const logo_url = `/api/v1/config/contrato/tenants/${tenantId}/logo?v=${subida.key.slice(-8)}`;
    return { logo_key: subida.key, logo_url };
  }
}

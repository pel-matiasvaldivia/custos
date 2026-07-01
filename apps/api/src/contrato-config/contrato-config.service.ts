import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { TenantContextService } from '../common/context/tenant-context.service';
import { PLANTILLA_CONTRATO_DEFAULT } from './plantilla-contrato.default';

@Injectable()
export class ContratoConfigService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private tenantContext: TenantContextService,
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
      ? `/api/v1/config/contrato/tenants/${tenantId}/firma?v=${config.firma_key.slice(-8)}`
      : null;

    const logo_key = (config as any).logo_key as string | null ?? null;
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
    const config = await this.tenantContext.run(tenantId, () =>
      this.prisma.configuracionContrato.findUnique({
        where: { tenant_id: tenantId },
      }),
    );
    const key = (config as any)?.logo_key as string | null | undefined;
    if (!key) throw new NotFoundException('Sin logo');
    return this.storageService.descargar(key);
  }

  async servirFirma(tenantId: string) {
    const config = await this.tenantContext.run(tenantId, () =>
      this.prisma.configuracionContrato.findUnique({
        where: { tenant_id: tenantId },
      }),
    );
    if (!config?.firma_key) throw new NotFoundException('Sin firma');
    return this.storageService.descargar(config.firma_key);
  }

  async actualizarLogo(tenantId: string, file: Express.Multer.File) {
    const existente = await this.prisma.configuracionContrato.findUnique({
      where: { tenant_id: tenantId },
    });
    const existenteLogo = (existente as any)?.logo_key as string | null ?? null;

    const subida = await this.storageService.subir(
      file.buffer,
      file.originalname,
      file.mimetype,
      'logos',
    );

    await this.prisma.configuracionContrato.upsert({
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

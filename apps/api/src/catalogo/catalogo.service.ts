import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CATALOGO_DEFAULTS, slugifyCodigo } from './catalogo.constants';

@Injectable()
export class CatalogoService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, categoria: string) {
    const defaults = CATALOGO_DEFAULTS[categoria] || [];
    const items = await this.prisma.catalogoItem.findMany({
      where: { tenant_id: tenantId, categoria, activo: true },
      orderBy: { created_at: 'asc' },
    });

    return [
      ...defaults.map((d) => ({ id: null, codigo: d.codigo, etiqueta: d.etiqueta, esDefault: true })),
      ...items.map((i) => ({ id: i.id, codigo: i.codigo, etiqueta: i.etiqueta, esDefault: false })),
    ];
  }

  async create(tenantId: string, categoria: string, etiqueta: string) {
    const baseCodigo = slugifyCodigo(etiqueta);
    if (!baseCodigo) {
      throw new BadRequestException('La etiqueta debe contener al menos una letra o número.');
    }

    let codigo = baseCodigo;
    let intento = 1;
    while (
      await this.prisma.catalogoItem.findFirst({
        where: { tenant_id: tenantId, categoria, codigo },
      })
    ) {
      intento += 1;
      codigo = `${baseCodigo}_${intento}`;
    }

    return this.prisma.catalogoItem.create({
      data: { tenant_id: tenantId, categoria, codigo, etiqueta },
    });
  }

  async remove(tenantId: string, categoria: string, id: string) {
    const item = await this.prisma.catalogoItem.findFirst({
      where: { id, tenant_id: tenantId, categoria },
    });
    if (!item) throw new NotFoundException('Item de catálogo no encontrado.');

    return this.prisma.catalogoItem.update({
      where: { id },
      data: { activo: false },
    });
  }
}

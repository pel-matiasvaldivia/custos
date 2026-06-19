import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PuestoService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.puesto.findMany({
      where: { tenant_id: tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    const puesto = await this.prisma.puesto.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!puesto) throw new NotFoundException('Puesto no encontrado');
    return puesto;
  }

  async create(data: Prisma.PuestoUncheckedCreateInput) {
    return this.prisma.puesto.create({
      data,
    });
  }

  async update(id: string, tenantId: string, data: Prisma.PuestoUncheckedUpdateInput) {
    await this.findOne(id, tenantId);
    return this.prisma.puesto.update({
      where: { id },
      data,
    });
  }
}

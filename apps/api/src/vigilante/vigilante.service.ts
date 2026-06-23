import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VigilanteService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.vigilador.findMany({
      where: { tenant_id: tenantId },
      include: {
        credenciales: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id, tenant_id: tenantId },
      include: {
        credenciales: true,
      },
    });
    if (!vigilador) throw new NotFoundException('Vigilador no encontrado');
    return vigilador;
  }

  async create(data: Prisma.VigiladorUncheckedCreateInput) {
    return this.prisma.vigilador.create({
      data,
    });
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.VigiladorUncheckedUpdateInput,
  ) {
    // Ensure it belongs to the tenant
    await this.findOne(id, tenantId);
    return this.prisma.vigilador.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.vigilador.delete({
      where: { id },
    });
  }
}

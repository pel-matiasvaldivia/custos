import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class VigilanteService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.vigilador.findMany({
        where: { tenant_id: tenantId },
        include: { credenciales: true },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vigilador.count({ where: { tenant_id: tenantId } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
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

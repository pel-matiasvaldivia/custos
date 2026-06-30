import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class VehiculoService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.vehiculo.findMany({
        where: { tenant_id: tenantId },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vehiculo.count({ where: { tenant_id: tenantId } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return vehiculo;
  }

  async create(data: Prisma.VehiculoUncheckedCreateInput) {
    return this.prisma.vehiculo.create({ data });
  }
}

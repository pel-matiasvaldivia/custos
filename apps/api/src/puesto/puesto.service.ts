import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PuestoService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.puesto.findMany({
        where: { tenant_id: tenantId },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.puesto.count({ where: { tenant_id: tenantId } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
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

  async update(
    id: string,
    tenantId: string,
    data: Prisma.PuestoUncheckedUpdateInput,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.puesto.update({
      where: { id },
      data,
    });
  }

  /**
   * CENTRAL STAFFING FORMULA
   * dotacion = H_cubrir / (horas_nominales_mes * (1 - tasa_ausentismo))
   */
  async calculateStaffing(
    hCubrir: number,
    hNominales: number = 192,
    tasaAusentismo: number = 0.1,
  ) {
    const hEfectivas = hNominales * (1 - tasaAusentismo);
    const dotacion = hCubrir / hEfectivas;
    return {
      hCubrir,
      hEfectivas,
      dotacion: parseFloat(dotacion.toFixed(2)),
      vigiladoresRequeridos: Math.ceil(dotacion),
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CredencialService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.credencial.findMany({
      where: { tenant_id: tenantId },
      include: {
        vigilador: true,
      },
    });
  }

  async findExpiringSoon(tenantId: string, days: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + days);

    return this.prisma.credencial.findMany({
      where: {
        tenant_id: tenantId,
        vence_el: {
          lte: thresholdDate,
          gte: new Date(),
        },
      },
      include: {
        vigilador: true,
      },
    });
  }

  async create(data: Prisma.CredencialUncheckedCreateInput) {
    return this.prisma.credencial.create({
      data,
    });
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.CredencialUncheckedUpdateInput,
  ) {
    const cred = await this.prisma.credencial.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!cred) throw new NotFoundException('Credencial no encontrada');

    return this.prisma.credencial.update({
      where: { id },
      data,
    });
  }
}

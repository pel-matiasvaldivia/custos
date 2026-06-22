import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CostosService {
  constructor(private prisma: PrismaService) {}

  async findOne(tenantId: string) {
    let config = await this.prisma.configuracionCostos.findUnique({
      where: { tenant_id: tenantId },
    });

    if (!config) {
      // Create default config if not exists
      config = await this.prisma.configuracionCostos.create({
        data: {
          tenant_id: tenantId,
          costo_hora_base: new Prisma.Decimal(2500.00),
          cargas_sociales: new Prisma.Decimal(0.45),
          costos_uniforme: new Prisma.Decimal(15000.00),
          otros_costos: new Prisma.Decimal(5000.00),
          factor_ajuste: new Prisma.Decimal(1.0),
        },
      });
    }

    return config;
  }

  async update(tenantId: string, data: any) {
    return this.prisma.configuracionCostos.upsert({
      where: { tenant_id: tenantId },
      update: {
        ...data,
      },
      create: {
        tenant_id: tenantId,
        ...data,
      },
    });
  }
}

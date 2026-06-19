import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeriadoService {
  constructor(private prisma: PrismaService) {}

  async isFeriado(date: Date) {
    const feriado = await this.prisma.feriado.findFirst({
      where: { fecha: date },
    });
    return !!feriado;
  }

  async findAll(tenantId: string) {
    return this.prisma.feriados.findMany({
      where: { tenant_id: tenantId },
    });
  }
}

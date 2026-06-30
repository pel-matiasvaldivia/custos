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

  async findByVigilador(vigiladorId: string, tenantId: string) {
    return this.prisma.credencial.findMany({
      where: { vigilador_id: vigiladorId, tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
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
      data: normalizarFechas(data),
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
      data: normalizarFechas(data),
    });
  }
}

// `emitida_el`/`vence_el` llegan como string "AAAA-MM-DD" desde un form-data
// (multer no aplica el transform de class-validator); Prisma necesita un
// DateTime completo, no solo la fecha.
function normalizarFechas<T extends { emitida_el?: unknown; vence_el?: unknown }>(data: T): T {
  const normalizado = { ...data };
  if (typeof normalizado.emitida_el === 'string') {
    normalizado.emitida_el = new Date(normalizado.emitida_el) as never;
  }
  if (typeof normalizado.vence_el === 'string') {
    normalizado.vence_el = new Date(normalizado.vence_el) as never;
  }
  return normalizado;
}

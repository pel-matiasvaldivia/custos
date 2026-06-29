import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class NovedadService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: CreateNovedadDto) {
    return this.prisma.novedad.create({
      data: {
        tenant_id: tenantId,
        puesto_id: data.puesto_id,
        vigilador_id: data.vigilador_id,
        tipo: data.tipo,
        prioridad: data.prioridad ?? 'NORMAL',
        descripcion: data.descripcion,
        adjuntos: data.adjuntos ?? [],
      },
      include: {
        puesto: true,
        vigilador: true,
      },
    });
  }

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.novedad.findMany({
        where: { tenant_id: tenantId },
        include: { puesto: true, vigilador: true },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.novedad.count({ where: { tenant_id: tenantId } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findByPuesto(tenantId: string, puestoId: string) {
    return this.prisma.novedad.findMany({
      where: { tenant_id: tenantId, puesto_id: puestoId },
      include: { vigilador: true },
      orderBy: { created_at: 'desc' },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NovedadService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.novedad.create({
      data: {
        tenant_id: tenantId,
        puesto_id: data.puesto_id,
        vigilador_id: data.vigilador_id,
        tipo: data.tipo,
        prioridad: data.prioridad || 'NORMAL',
        descripcion: data.descripcion,
        adjuntos: data.adjuntos || [],
      },
      include: {
        puesto: true,
        vigilador: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.novedad.findMany({
      where: { tenant_id: tenantId },
      include: {
        puesto: true,
        vigilador: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async findByPuesto(tenantId: string, puestoId: string) {
    return this.prisma.novedad.findMany({
      where: { tenant_id: tenantId, puesto_id: puestoId },
      include: { vigilador: true },
      orderBy: { created_at: 'desc' },
    });
  }
}

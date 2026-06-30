import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class HerramientaService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.herramienta.findMany({
        where: { tenant_id: tenantId, deleted_at: null },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.herramienta.count({ where: { tenant_id: tenantId, deleted_at: null } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const herramienta = await this.prisma.herramienta.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
      include: { asignaciones: { where: { devuelta_el: null }, include: { vigilador: true } } },
    });
    if (!herramienta) throw new NotFoundException('Herramienta no encontrada');
    return herramienta;
  }

  async create(data: Prisma.HerramientaUncheckedCreateInput) {
    const codigo =
      data.codigo ||
      `HER-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    return this.prisma.herramienta.create({ data: { ...data, codigo } });
  }

  async findHerramientasDeVigilador(vigiladorId: string, tenantId: string) {
    return this.prisma.herramientaAsignacion.findMany({
      where: { vigilador_id: vigiladorId, tenant_id: tenantId, devuelta_el: null },
      include: { herramienta: true },
    });
  }

  async asignar(
    herramientaId: string,
    tenantId: string,
    vigiladorId: string,
    observaciones?: string,
  ) {
    const herramienta = await this.findOne(herramientaId, tenantId);
    if (herramienta.estado !== 'DISPONIBLE') {
      throw new BadRequestException(
        'La herramienta no está disponible para asignar.',
      );
    }

    if (herramienta.tipo === 'ARMA') {
      const credencialAnmac = await this.prisma.credencial.findFirst({
        where: {
          vigilador_id: vigiladorId,
          tenant_id: tenantId,
          tipo: 'ANMAC',
          vence_el: { gte: new Date() },
        },
      });
      if (!credencialAnmac) {
        throw new BadRequestException(
          'No se puede asignar un arma: el vigilador no tiene credencial ANMAC vigente.',
        );
      }
    }

    const [asignacion] = await this.prisma.$transaction([
      this.prisma.herramientaAsignacion.create({
        data: {
          tenant_id: tenantId,
          herramienta_id: herramientaId,
          vigilador_id: vigiladorId,
          observaciones,
        },
      }),
      this.prisma.herramienta.update({
        where: { id: herramientaId },
        data: { estado: 'ASIGNADA' },
      }),
    ]);

    return asignacion;
  }

  async devolver(herramientaId: string, tenantId: string) {
    await this.findOne(herramientaId, tenantId);
    const asignacionActiva = await this.prisma.herramientaAsignacion.findFirst({
      where: { herramienta_id: herramientaId, tenant_id: tenantId, devuelta_el: null },
    });
    if (!asignacionActiva) {
      throw new BadRequestException('La herramienta no tiene una asignación activa.');
    }

    const [asignacion] = await this.prisma.$transaction([
      this.prisma.herramientaAsignacion.update({
        where: { id: asignacionActiva.id },
        data: { devuelta_el: new Date() },
      }),
      this.prisma.herramienta.update({
        where: { id: herramientaId },
        data: { estado: 'DISPONIBLE' },
      }),
    ]);

    return asignacion;
  }
}

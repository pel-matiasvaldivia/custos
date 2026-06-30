import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto, busqueda?: string) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;
    const where = {
      tenant_id: tenantId,
      deleted_at: null,
      ...(busqueda
        ? { razon_social: { contains: busqueda, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: { razon_social: 'asc' },
      }),
      this.prisma.cliente.count({ where }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado.');
    return cliente;
  }

  async create(tenantId: string, dto: CreateClienteDto) {
    return this.prisma.cliente.create({
      data: { ...dto, tenant_id: tenantId },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateClienteDto) {
    await this.findOne(id, tenantId);
    return this.prisma.cliente.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.cliente.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}

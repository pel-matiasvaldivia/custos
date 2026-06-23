import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');
    return tenant;
  }

  async create(data: Prisma.TenantCreateInput) {
    return this.prisma.tenant.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TenantUpdateInput) {
    await this.findOne(id);
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }
}

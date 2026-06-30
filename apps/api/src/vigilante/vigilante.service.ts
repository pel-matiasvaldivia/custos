import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

const CREDENCIALES_BASICAS = ['CARNET_VIGILADOR', 'PSICOFISICO', 'ANTECEDENTES'];

@Injectable()
export class VigilanteService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.vigilador.findMany({
        where: { tenant_id: tenantId, deleted_at: null },
        include: { credenciales: true },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vigilador.count({ where: { tenant_id: tenantId, deleted_at: null } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
      include: {
        credenciales: true,
      },
    });
    if (!vigilador) throw new NotFoundException('Vigilador no encontrado');
    return vigilador;
  }

  async create(data: Prisma.VigiladorUncheckedCreateInput) {
    return this.prisma.vigilador.create({
      data,
    });
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.VigiladorUncheckedUpdateInput,
  ) {
    await this.findOne(id, tenantId);
    await this.prisma.vigilador.update({
      where: { id },
      data,
    });
    return this.recalcularCompletitud(id, tenantId);
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.vigilador.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async setFoto(id: string, tenantId: string, fotoUrl: string) {
    await this.findOne(id, tenantId);
    await this.prisma.vigilador.update({
      where: { id },
      data: { foto_url: fotoUrl },
    });
    return this.recalcularCompletitud(id, tenantId);
  }

  async getCompletitud(id: string, tenantId: string) {
    const vigilador = await this.findOne(id, tenantId);
    return this.calcularChecklist(vigilador);
  }

  private calcularChecklist(vigilador: {
    foto_url: string | null;
    domicilio: string | null;
    telefono: string | null;
    credenciales: { tipo: string }[];
  }) {
    const tiposCargados = new Set(vigilador.credenciales.map((c) => c.tipo));
    const credencialesFaltantes = CREDENCIALES_BASICAS.filter(
      (tipo) => !tiposCargados.has(tipo),
    );

    const faltantes: string[] = [];
    if (!vigilador.foto_url) faltantes.push('foto');
    if (!vigilador.domicilio) faltantes.push('domicilio');
    if (!vigilador.telefono) faltantes.push('telefono');
    faltantes.push(...credencialesFaltantes.map((tipo) => `credencial:${tipo}`));

    return { completo: faltantes.length === 0, faltantes };
  }

  async recalcularCompletitud(id: string, tenantId: string) {
    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id, tenant_id: tenantId },
      include: { credenciales: true },
    });
    if (!vigilador) return null;

    const { completo } = this.calcularChecklist(vigilador);
    return this.prisma.vigilador.update({
      where: { id },
      data: { completitud: completo ? 'COMPLETO' : 'INCOMPLETO' },
    });
  }
}

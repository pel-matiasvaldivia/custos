import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaAdminService } from '../prisma/prisma-admin.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const SAFE_SELECT = {
  id: true,
  nombre: true,
  email: true,
  role: true,
  created_at: true,
  deleted_at: true,
};

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaAdminService) {}

  async listar(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenant_id: tenantId, deleted_at: null },
      select: SAFE_SELECT,
      orderBy: { created_at: 'asc' },
    });
  }

  async crear(tenantId: string, actorId: string, dto: CreateUsuarioDto) {
    const existe = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existe) throw new BadRequestException('Ya existe un usuario con ese email.');

    const hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        tenant_id: tenantId,
        nombre: dto.nombre ?? null,
        email: dto.email,
        password: hash,
        role: dto.role,
      },
      select: SAFE_SELECT,
    });
  }

  async actualizar(tenantId: string, id: string, dto: UpdateUsuarioDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    return this.prisma.user.update({
      where: { id },
      data: {
        nombre: dto.nombre ?? undefined,
        role: dto.role ?? undefined,
      },
      select: SAFE_SELECT,
    });
  }

  async resetPassword(tenantId: string, actorId: string, id: string, nuevaPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    if (user.id === actorId) throw new ForbiddenException('Usá el cambio de contraseña propio.');

    const hash = await bcrypt.hash(nuevaPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { password: hash, failed_attempts: 0, locked_until: null } });
    return { ok: true };
  }

  async eliminar(tenantId: string, actorId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    if (user.id === actorId) throw new ForbiddenException('No podés eliminarte a vos mismo.');

    await this.prisma.user.update({ where: { id }, data: { deleted_at: new Date() } });
    return { ok: true };
  }
}

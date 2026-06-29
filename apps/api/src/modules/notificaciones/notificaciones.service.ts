import { Injectable, Logger } from '@nestjs/common';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';

/**
 * Lógica de dominio de notificaciones. Independiente de la cola (BullMQ) para
 * poder testearse sin Redis. El worker la invoca de forma programada.
 *
 * Es un job de fan-out cross-tenant (escanea todas las empresas), sin contexto
 * de tenant: usa el cliente admin (omite RLS) y fija `tenant_id` explícito en
 * cada filtro y escritura para mantener el aislamiento por código.
 */
@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(private prisma: PrismaAdminService) {}

  /**
   * Detecta credenciales que vencen dentro de `diasUmbral` y crea una
   * notificación IN_APP por cada destinatario (ADMIN/RRHH) del tenant.
   * Es idempotente: no duplica si ya existe una notificación no leída para esa
   * credencial y destinatario.
   *
   * @returns cantidad de notificaciones creadas.
   */
  async generarAvisosCredencialesPorVencer(diasUmbral = 30): Promise<number> {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(limite.getDate() + diasUmbral);

    const credenciales = await this.prisma.credencial.findMany({
      where: { vence_el: { gte: hoy, lte: limite } },
      select: {
        id: true,
        tenant_id: true,
        tipo: true,
        vence_el: true,
        vigilador_id: true,
      },
    });

    let creadas = 0;
    for (const cred of credenciales) {
      const destinatarios = await this.prisma.user.findMany({
        where: {
          tenant_id: cred.tenant_id,
          role: { in: ['ADMIN', 'RRHH'] },
          deleted_at: null,
        },
        select: { id: true },
      });

      for (const dest of destinatarios) {
        const yaExiste = await this.prisma.notificacion.findFirst({
          where: {
            tenant_id: cred.tenant_id,
            destinatario_id: dest.id,
            tipo: 'CREDENCIAL_POR_VENCER',
            leida: false,
            payload: { path: ['credencial_id'], equals: cred.id },
          },
          select: { id: true },
        });
        if (yaExiste) continue;

        await this.prisma.notificacion.create({
          data: {
            tenant_id: cred.tenant_id,
            destinatario_id: dest.id,
            tipo: 'CREDENCIAL_POR_VENCER',
            canal: 'IN_APP',
            payload: {
              credencial_id: cred.id,
              vigilador_id: cred.vigilador_id,
              tipo: cred.tipo,
              vence_el: cred.vence_el?.toISOString() ?? null,
            },
          },
        });
        creadas++;
      }
    }

    this.logger.log(
      `Avisos de credenciales por vencer (${diasUmbral}d): ${creadas} creadas.`,
    );
    return creadas;
  }
}

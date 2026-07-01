import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';

export type PlanId = 'mensual' | 'anual';

const PLANES: Record<PlanId, { nombre: string; precio: number; meses: number }> = {
  mensual: { nombre: 'Plan Mensual', precio: 29900, meses: 1 },
  anual:   { nombre: 'Plan Anual',   precio: 299000, meses: 12 },
};

@Injectable()
export class SuscripcionService {
  constructor(private readonly prisma: PrismaAdminService) {}

  async getEstado(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true, trial_hasta: true, suscripcion_id: true, created_at: true },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado.');

    let plan = tenant.plan;
    let diasRestantes: number | null = null;

    if (plan === 'TRIAL' && tenant.trial_hasta) {
      const ahora = new Date();
      if (tenant.trial_hasta < ahora) {
        // Auto-transición
        await this.prisma.tenant.update({
          where: { id: tenantId },
          data: { plan: 'VENCIDO' },
        });
        plan = 'VENCIDO';
      } else {
        diasRestantes = Math.ceil(
          (tenant.trial_hasta.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24),
        );
      }
    }

    return {
      plan,
      trial_hasta: tenant.trial_hasta,
      dias_restantes: diasRestantes,
      suscripcion_id: tenant.suscripcion_id,
    };
  }

  /**
   * Crea una preferencia de pago en MercadoPago (Checkout Pro).
   * Requiere MP_ACCESS_TOKEN en env. Si no está configurado devuelve un objeto
   * con `demo: true` para desarrollo.
   */
  async crearCheckoutMP(tenantId: string, planId: PlanId, backUrl: string) {
    const plan = PLANES[planId];
    if (!plan) throw new BadRequestException('Plan inválido.');

    const mpToken = process.env.MP_ACCESS_TOKEN;

    if (!mpToken) {
      // Modo demo: devuelve estructura sin llamar a MP
      return {
        demo: true,
        plan: planId,
        mensaje:
          'Configurá MP_ACCESS_TOKEN en el entorno para activar pagos reales.',
        init_point: null,
      };
    }

    const body = {
      items: [
        {
          id: planId,
          title: plan.nombre,
          quantity: 1,
          unit_price: plan.precio / 100, // MP trabaja en pesos con decimales
          currency_id: 'ARS',
        },
      ],
      external_reference: tenantId,
      back_urls: {
        success: `${backUrl}/suscripcion?resultado=ok`,
        failure: `${backUrl}/suscripcion?resultado=error`,
        pending: `${backUrl}/suscripcion?resultado=pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.API_PUBLIC_URL ?? ''}/suscripcion/mp/webhook`,
    };

    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mpToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new BadRequestException(`Error MercadoPago: ${err}`);
    }

    const data: any = await response.json();
    return { init_point: data.init_point, sandbox_init_point: data.sandbox_init_point };
  }

  /** Webhook IPN de MercadoPago. Activa el plan cuando el pago es aprobado. */
  async procesarWebhookMP(body: any) {
    const mpToken = process.env.MP_ACCESS_TOKEN;
    if (!mpToken) return { ok: true };

    const { type, data } = body;
    if (type !== 'payment') return { ok: true };

    // Consultar el pago a MP para validar
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${data.id}`,
      { headers: { Authorization: `Bearer ${mpToken}` } },
    );
    if (!res.ok) return { ok: true };

    const pago: any = await res.json();
    if (pago.status !== 'approved') return { ok: true };

    const tenantId: string = pago.external_reference;
    if (!tenantId) return { ok: true };

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        plan: 'ACTIVO',
        suscripcion_id: String(pago.id),
        trial_hasta: null,
      },
    });

    return { ok: true };
  }

  /** SUPERADMIN: activa plan manualmente (demo / soporte). */
  async activarManual(tenantId: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: 'ACTIVO', trial_hasta: null },
    });
    return { ok: true };
  }
}

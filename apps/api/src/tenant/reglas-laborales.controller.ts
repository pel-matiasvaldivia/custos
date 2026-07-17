import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

export class ActualizarReglasLiquidacionDto {
  @IsOptional()
  @IsBoolean()
  pagar_recargo_feriado?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(300)
  recargo_feriado_pct?: number;

  @IsOptional()
  @IsBoolean()
  adelanto_movil_habilitado?: boolean;
}

/**
 * Configuración de las reglas de liquidación del tenant: si se paga el recargo
 * por feriado trabajado (y con qué porcentaje) y si el personal puede solicitar
 * adelantos de sueldo desde la app móvil. Las demás reglas laborales (jornada,
 * descansos, ventana nocturna) conservan sus defaults del spec.
 */
@Controller('config/reglas-laborales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReglasLaboralesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  async get(@Request() req: any) {
    const r = await this.prisma.reglaLaboral.findUnique({
      where: { tenant_id: req.user.tenantId },
    });
    return {
      pagar_recargo_feriado: r?.pagar_recargo_feriado ?? false,
      recargo_feriado_pct: r?.recargo_feriado_pct ?? 100,
      adelanto_movil_habilitado: r?.adelanto_movil_habilitado ?? false,
      recargo_nocturno_pct: r?.recargo_nocturno_pct ?? 20,
      recargo_extra_pct: r?.recargo_extra_pct ?? 50,
    };
  }

  @Put()
  @Roles('ADMIN', 'SUPERADMIN')
  async actualizar(
    @Request() req: any,
    @Body() dto: ActualizarReglasLiquidacionDto,
  ) {
    const data = {
      pagar_recargo_feriado: dto.pagar_recargo_feriado,
      recargo_feriado_pct: dto.recargo_feriado_pct,
      adelanto_movil_habilitado: dto.adelanto_movil_habilitado,
    };
    const r = await this.prisma.reglaLaboral.upsert({
      where: { tenant_id: req.user.tenantId },
      create: { tenant_id: req.user.tenantId, ...data },
      update: { ...data, updated_at: new Date() },
    });
    return {
      pagar_recargo_feriado: r.pagar_recargo_feriado,
      recargo_feriado_pct: r.recargo_feriado_pct,
      adelanto_movil_habilitado: r.adelanto_movil_habilitado,
      recargo_nocturno_pct: r.recargo_nocturno_pct,
      recargo_extra_pct: r.recargo_extra_pct,
    };
  }
}

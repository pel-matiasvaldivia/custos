import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { LiquidacionesService } from './liquidaciones.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('liquidaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiquidacionesController {
  constructor(private readonly liquidaciones: LiquidacionesService) {}

  /**
   * Cómputo de horas por vigilador para el rango indicado.
   * GET /liquidaciones?desde=2026-07-01&hasta=2026-07-31
   */
  @Get()
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  computar(
    @Request() req: any,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.liquidaciones.computar(req.user.tenantId, desde, hasta);
  }
}

import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  /** KPIs del tenant autenticado. */
  @Get('kpis')
  kpis(@Request() req: any) {
    return this.dashboard.kpis(req.user.tenantId);
  }

  /** Progreso de primeros pasos (guía de inicio). */
  @Get('onboarding')
  onboarding(@Request() req: any) {
    return this.dashboard.onboarding(req.user.tenantId);
  }
}

import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CredencialService } from './credencial.service';

@Controller('credenciales')
@UseGuards(JwtAuthGuard)
export class CredencialAlertasController {
  constructor(private readonly credencialService: CredencialService) {}

  @Get('alertas')
  async findAlertas(@Query('dias') dias: string | undefined, @Request() req: any) {
    return this.credencialService.findAlertas(req.user.tenantId, dias ? Number(dias) : 15);
  }
}

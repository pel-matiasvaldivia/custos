import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LiquidacionesService } from './liquidaciones.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CerrarLiquidacionDto } from './dto/cerrar-liquidacion.dto';

@Controller('liquidaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiquidacionesController {
  constructor(private readonly liquidaciones: LiquidacionesService) {}

  /**
   * Cómputo (preview) de horas y montos por vigilador para el rango indicado.
   * GET /liquidaciones?desde=2026-07-01&hasta=2026-07-31&valor_hora_default=2500
   */
  @Get()
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  computar(
    @Request() req: any,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Query('valor_hora_default') valorHoraDefault?: string,
  ) {
    return this.liquidaciones.computar(
      req.user.tenantId,
      desde,
      hasta,
      valorHoraDefault ? Number(valorHoraDefault) : 0,
    );
  }

  /** Config del modo de liquidación del tenant. */
  @Get('config')
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  getConfig(@Request() req: any) {
    return this.liquidaciones.getConfig(req.user.tenantId);
  }

  @Post('config')
  @Roles('ADMIN', 'SUPERADMIN')
  setConfig(@Request() req: any, @Body() body: { modo: string }) {
    return this.liquidaciones.setModo(req.user.tenantId, body.modo);
  }

  /** Historial de liquidaciones cerradas. */
  @Get('historial')
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  historial(@Request() req: any) {
    return this.liquidaciones.historial(req.user.tenantId);
  }

  /** Detalle de una liquidación cerrada. */
  @Get(':id')
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  obtener(@Request() req: any, @Param('id') id: string) {
    return this.liquidaciones.obtener(req.user.tenantId, id);
  }

  /** Cierra el período y persiste la liquidación (descuenta adelantos). */
  @Post('cerrar')
  @Roles('ADMIN', 'GERENCIA', 'SUPERADMIN')
  cerrar(@Request() req: any, @Body() dto: CerrarLiquidacionDto) {
    return this.liquidaciones.cerrar(req.user.tenantId, dto);
  }
}

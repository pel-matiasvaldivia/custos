import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CuadranteService } from './cuadrante.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('cuadrante')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuadranteController {
  constructor(private readonly cuadranteService: CuadranteService) {}

  // Generar turnos a partir de una asignación de esquema.
  @Post('generar/:asignacionEsquemaId')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR')
  generar(
    @Request() req: any,
    @Param('asignacionEsquemaId') asignacionEsquemaId: string,
    @Body() body: { desde: string; hasta: string },
  ) {
    return this.cuadranteService.generarCuadrante(
      req.user.tenantId,
      asignacionEsquemaId,
      new Date(body.desde),
      new Date(body.hasta),
    );
  }

  // Cerrar período (congela ConciliacionHH). Sólo GERENCIA/ADMIN.
  @Post('periodos/:periodoId/cerrar')
  @Roles('ADMIN', 'GERENCIA')
  cerrar(@Request() req: any, @Param('periodoId') periodoId: string) {
    return this.cuadranteService.cerrarPeriodo(
      req.user.tenantId,
      periodoId,
      req.user.userId,
    );
  }
}

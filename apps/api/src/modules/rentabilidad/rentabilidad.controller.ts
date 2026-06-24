import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { RentabilidadService } from './rentabilidad.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('rentabilidad')
@UseGuards(JwtAuthGuard, RolesGuard)
// Montos de costo/margen sólo para GERENCIA/ADMIN (MODELOS_M2_A_M6 L604).
@Roles('ADMIN', 'GERENCIA')
export class RentabilidadController {
  constructor(private readonly rentabilidadService: RentabilidadService) {}

  // GET /api/v1/rentabilidad/contratos?periodo=<id>  → estimado vs real + erosión.
  @Get('contratos')
  async porContrato(@Request() req: any, @Query('periodo') periodo: string) {
    if (!periodo) {
      throw new BadRequestException('El parámetro "periodo" es obligatorio');
    }
    return this.rentabilidadService.rentabilidadPorContrato(
      req.user.tenantId,
      periodo,
    );
  }
}

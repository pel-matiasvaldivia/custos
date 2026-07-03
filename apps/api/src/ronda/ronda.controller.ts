import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RondaService } from './ronda.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rondas')
@UseGuards(JwtAuthGuard)
export class RondaController {
  constructor(private readonly rondaService: RondaService) {}

  @Post('checkpoints')
  createCheckpoint(@Request() req: any, @Body() data: any) {
    return this.rondaService.createCheckpoint(req.user.tenantId, data);
  }

  // ─── Plantillas de ronda (rondas programadas) ───

  @Post('plantillas')
  crearPlantilla(@Request() req: any, @Body() data: any) {
    return this.rondaService.crearPlantilla(req.user.tenantId, data);
  }

  @Get('plantillas')
  listarPlantillas(
    @Request() req: any,
    @Query('objetivoId') objetivoId: string,
  ) {
    return this.rondaService.listarPlantillas(req.user.tenantId, objetivoId);
  }

  @Put('plantillas/:id')
  actualizarPlantilla(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.rondaService.actualizarPlantilla(req.user.tenantId, id, data);
  }

  @Delete('plantillas/:id')
  desactivarPlantilla(@Request() req: any, @Param('id') id: string) {
    return this.rondaService.desactivarPlantilla(req.user.tenantId, id);
  }

  @Get('ejecuciones')
  ejecuciones(@Request() req: any, @Query('objetivoId') objetivoId: string) {
    return this.rondaService.ejecucionesPorObjetivo(
      req.user.tenantId,
      objetivoId,
    );
  }

  @Get('checkpoints/:puestoId')
  getCheckpoints(@Request() req: any, @Param('puestoId') puestoId: string) {
    return this.rondaService.getCheckpointsByPuesto(
      req.user.tenantId,
      puestoId,
    );
  }
}

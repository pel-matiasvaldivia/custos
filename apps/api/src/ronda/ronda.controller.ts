import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
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

  @Get('checkpoints/:puestoId')
  getCheckpoints(@Request() req: any, @Param('puestoId') puestoId: string) {
    return this.rondaService.getCheckpointsByPuesto(
      req.user.tenantId,
      puestoId,
    );
  }

  @Post('start')
  startRonda(@Request() req: any, @Body() data: any) {
    return this.rondaService.startRonda(req.user.tenantId, data);
  }

  @Post(':id/mark')
  markCheckpoint(
    @Request() req: any,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.rondaService.markCheckpoint(req.user.tenantId, id, data);
  }

  @Patch(':id/finish')
  finishRonda(@Request() req: any, @Param('id') id: string) {
    return this.rondaService.finishRonda(req.user.tenantId, id);
  }

  @Get('active')
  getActive(@Request() req: any) {
    return this.rondaService.getActiveRondas(req.user.tenantId);
  }
}

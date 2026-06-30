import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VigilanciaMovilService } from './vigilancia-movil.service';
import { VigiladorJwtGuard } from '../vigilante-auth/vigilador-jwt.guard';
import { RelevosService } from '../relevos/relevos.service';
import { SolicitarRelevoDto } from '../relevos/dto/solicitar-relevo.dto';

@Controller('mobile')
@UseGuards(VigiladorJwtGuard)
export class VigilanciaMovilController {
  constructor(
    private readonly mobileService: VigilanciaMovilService,
    private readonly relevosService: RelevosService,
  ) {}

  @Post('checkpoint')
  async scanCheckpoint(
    @Body() data: { checkpointId: string; location?: any },
    @Request() req: any,
  ) {
    return this.mobileService.registrarPuntoControl(
      req.user.vigiladorId,
      data.checkpointId,
      data.location,
    );
  }

  @Post('panic')
  async triggerPanic(
    @Body() data: { location: { lat: number; lng: number } },
    @Request() req: any,
  ) {
    return this.mobileService.dispararPanico(
      req.user.vigiladorId,
      req.user.tenantId,
      data.location,
    );
  }

  @Post('tracking')
  async updateLocation(
    @Body() data: { location: { lat: number; lng: number } },
    @Request() req: any,
  ) {
    return this.mobileService.updateLocation(
      req.user.vigiladorId,
      req.user.tenantId,
      data.location,
    );
  }

  @Get('turno-actual')
  async turnoActual(@Request() req: any) {
    return this.mobileService.turnoActual(
      req.user.tenantId,
      req.user.vigiladorId,
    );
  }

  @Post('asistencia/checkin')
  async checkin(
    @Body()
    data: {
      turnoId: string;
      metodo: string;
      location?: { lat: number; lng: number };
    },
    @Request() req: any,
  ) {
    return this.mobileService.checkin(
      req.user.tenantId,
      req.user.vigiladorId,
      data.turnoId,
      data.metodo,
      data.location,
    );
  }

  @Post('asistencia/checkout')
  async checkout(
    @Body()
    data: {
      turnoId: string;
      metodo: string;
      location?: { lat: number; lng: number };
    },
    @Request() req: any,
  ) {
    return this.mobileService.checkout(
      req.user.tenantId,
      req.user.vigiladorId,
      data.turnoId,
      data.metodo,
      data.location,
    );
  }

  @Post('relevos')
  async solicitarRelevo(@Body() dto: SolicitarRelevoDto, @Request() req: any) {
    return this.relevosService.solicitar(
      req.user.tenantId,
      req.user.vigiladorId,
      dto,
    );
  }
}

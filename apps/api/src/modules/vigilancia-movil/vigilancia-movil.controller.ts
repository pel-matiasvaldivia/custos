import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VigilanciaMovilService } from './vigilancia-movil.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('mobile')
@UseGuards(JwtAuthGuard)
export class VigilanciaMovilController {
  constructor(private readonly mobileService: VigilanciaMovilService) {}

  @Post('checkpoint')
  async scanCheckpoint(
    @Body() data: { checkpointId: string; location?: any },
    @Request() req: any,
  ) {
    return this.mobileService.registrarPuntoControl(
      req.user.userId,
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
      req.user.userId,
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
      req.user.userId,
      req.user.tenantId,
      data.location,
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CentroOperacionesService } from './centro-operaciones.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ResolveIncidentDto } from './dto/resolve-incident.dto';

@Controller('centro-operaciones')
@UseGuards(JwtAuthGuard)
export class CentroOperacionesController {
  constructor(private readonly coService: CentroOperacionesService) {}

  @Get('incidentes/activos')
  async getActiveIncidents(@Request() req: any) {
    return this.coService.getActiveIncidents(req.user.tenantId);
  }

  @Post('incidentes/:id/tomar')
  async takeIncident(@Param('id') id: string, @Request() req: any) {
    return this.coService.takeIncident(id, req.user.id);
  }

  @Post('incidentes/:id/resolver')
  async resolveIncident(
    @Param('id') id: string,
    @Body() data: ResolveIncidentDto,
  ) {
    return this.coService.resolveIncident(id, data);
  }

  @Get('dispositivos')
  async getDevices(@Request() req: any) {
    return this.coService.getDevices(req.user.tenantId);
  }
}

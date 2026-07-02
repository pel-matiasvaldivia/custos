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
import {
  VerificarIncidentDto,
  DespacharIncidentDto,
  NotaIncidentDto,
} from './dto/protocolo-incident.dto';

@Controller('centro-operaciones')
@UseGuards(JwtAuthGuard)
export class CentroOperacionesController {
  constructor(private readonly coService: CentroOperacionesService) {}

  @Get('incidentes/activos')
  async getActiveIncidents(@Request() req: any) {
    return this.coService.getActiveIncidents(req.user.tenantId);
  }

  @Get('incidentes/:id')
  async getIncident(@Param('id') id: string, @Request() req: any) {
    return this.coService.getIncident(id, req.user.tenantId);
  }

  @Post('incidentes/:id/tomar')
  async takeIncident(@Param('id') id: string, @Request() req: any) {
    return this.coService.takeIncident(id, req.user.userId);
  }

  @Post('incidentes/:id/verificar')
  async verifyIncident(
    @Param('id') id: string,
    @Body() data: VerificarIncidentDto,
    @Request() req: any,
  ) {
    return this.coService.verifyIncident(id, req.user.userId, data);
  }

  @Post('incidentes/:id/despachar')
  async dispatchIncident(
    @Param('id') id: string,
    @Body() data: DespacharIncidentDto,
    @Request() req: any,
  ) {
    return this.coService.dispatchIncident(id, req.user.userId, data);
  }

  @Post('incidentes/:id/nota')
  async addNote(
    @Param('id') id: string,
    @Body() data: NotaIncidentDto,
    @Request() req: any,
  ) {
    return this.coService.addNote(id, req.user.userId, data.nota);
  }

  @Post('incidentes/:id/resolver')
  async resolveIncident(
    @Param('id') id: string,
    @Body() data: ResolveIncidentDto,
    @Request() req: any,
  ) {
    return this.coService.resolveIncident(id, data, req.user.userId);
  }

  @Get('dispositivos')
  async getDevices(@Request() req: any) {
    return this.coService.getDevices(req.user.tenantId);
  }
}

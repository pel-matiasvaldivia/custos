import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import {
  CrearDispositivoDto,
  ActualizarDispositivoDto,
  ActualizarCanalDto,
  ProbarDispositivoDto,
  MapearZonaCanalDto,
} from './dto/dispositivo.dto';

@Controller('centro-operaciones')
@UseGuards(JwtAuthGuard)
export class CentroOperacionesController {
  constructor(private readonly coService: CentroOperacionesService) {}

  @Get('incidentes/activos')
  async getActiveIncidents(@Request() req: any) {
    return this.coService.getActiveIncidents(req.user.tenantId);
  }

  // Declarado antes de 'incidentes/:id' para que "cerrados" no matchee como id.
  @Get('incidentes/cerrados')
  async getClosedIncidents(
    @Request() req: any,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.coService.getClosedIncidents(req.user.tenantId, desde, hasta);
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

  // === F1 · Onboarding ===
  @Post('dispositivos/probar')
  async probarDispositivo(@Body() dto: ProbarDispositivoDto) {
    return this.coService.probarConexion(dto);
  }

  @Post('dispositivos')
  async crearDispositivo(
    @Body() dto: CrearDispositivoDto,
    @Request() req: any,
  ) {
    return this.coService.crearDispositivo(req.user.tenantId, dto);
  }

  @Put('dispositivos/:id')
  async actualizarDispositivo(
    @Param('id') id: string,
    @Body() dto: ActualizarDispositivoDto,
    @Request() req: any,
  ) {
    return this.coService.actualizarDispositivo(req.user.tenantId, id, dto);
  }

  @Delete('dispositivos/:id')
  async eliminarDispositivo(@Param('id') id: string, @Request() req: any) {
    return this.coService.eliminarDispositivo(req.user.tenantId, id);
  }

  @Post('dispositivos/:id/descubrir')
  async descubrirCanales(@Param('id') id: string, @Request() req: any) {
    return this.coService.descubrirCanales(req.user.tenantId, id);
  }

  @Get('dispositivos/:id/canales')
  async getCanales(@Param('id') id: string, @Request() req: any) {
    return this.coService.getCanales(req.user.tenantId, id);
  }

  @Patch('canales/:id')
  async actualizarCanal(
    @Param('id') id: string,
    @Body() dto: ActualizarCanalDto,
    @Request() req: any,
  ) {
    return this.coService.actualizarCanal(req.user.tenantId, id, dto);
  }

  // === F4 · Mapeo zona → canal ===
  @Get('dispositivos/:id/zonas')
  async getZonas(@Param('id') id: string, @Request() req: any) {
    return this.coService.getZonasDeDispositivo(req.user.tenantId, id);
  }

  @Post('zonas/mapear')
  async mapearZonaCanal(@Body() dto: MapearZonaCanalDto, @Request() req: any) {
    return this.coService.mapearZonaCanal(
      req.user.tenantId,
      dto.zona_id,
      dto.canal_id ?? null,
    );
  }
}

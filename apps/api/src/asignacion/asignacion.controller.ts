import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AsignacionService } from './asignacion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { AsignarVigiladorDto } from './dto/asignar-vigilador.dto';
import { FindByObjetivoDto } from './dto/find-by-objetivo.dto';

@Controller('asignaciones')
@UseGuards(JwtAuthGuard)
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Get()
  async findByObjetivo(@Query() query: FindByObjetivoDto, @Request() req: any) {
    return this.asignacionService.findByObjetivo(
      req.user.tenantId,
      query.objetivoId,
      new Date(query.desde),
      new Date(query.hasta),
    );
  }

  @Post()
  async create(@Body() body: CreateAsignacionDto, @Request() req: any) {
    return this.asignacionService.create(req.user.tenantId, body);
  }

  @Put(':id/vigilador')
  async asignarVigilador(
    @Param('id') id: string,
    @Body() body: AsignarVigiladorDto,
    @Request() req: any,
  ) {
    return this.asignacionService.asignVigilante(id, req.user.tenantId, body.vigilador_id);
  }

  @Delete(':id/vigilador')
  async liberar(@Param('id') id: string, @Request() req: any) {
    return this.asignacionService.liberar(id, req.user.tenantId);
  }

  @Delete(':id')
  async deleteSlot(@Param('id') id: string, @Request() req: any) {
    await this.asignacionService.deleteSlot(id, req.user.tenantId);
    return { ok: true };
  }
}

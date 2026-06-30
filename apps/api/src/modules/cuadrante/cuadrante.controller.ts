import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CuadranteService } from './cuadrante.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateEsquemaTurnoDto } from './dto/create-esquema-turno.dto';
import { CreateAsignacionEsquemaDto } from './dto/create-asignacion-esquema.dto';
import { UpsertPuestoCoberturaDto } from './dto/upsert-puesto-cobertura.dto';

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

  // Detección de cobertura de un puesto: huecos y sobre-dotación.
  @Get('cobertura/:puestoId')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR', 'OPERADOR')
  cobertura(
    @Request() req: any,
    @Param('puestoId') puestoId: string,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    if (!desde || !hasta) {
      throw new BadRequestException(
        'Parámetros "desde" y "hasta" obligatorios',
      );
    }
    return this.cuadranteService.detectarCoberturaPuesto(
      req.user.tenantId,
      puestoId,
      new Date(desde),
      new Date(hasta),
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

  // ─── Esquemas de turno ───

  @Post('esquemas')
  @Roles('ADMIN', 'GERENCIA')
  crearEsquema(@Request() req: any, @Body() dto: CreateEsquemaTurnoDto) {
    return this.cuadranteService.crearEsquema(req.user.tenantId, dto);
  }

  @Get('esquemas')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR')
  listarEsquemas(@Request() req: any) {
    return this.cuadranteService.listarEsquemas(req.user.tenantId);
  }

  @Delete('esquemas/:id')
  @Roles('ADMIN', 'GERENCIA')
  eliminarEsquema(@Request() req: any, @Param('id') id: string) {
    return this.cuadranteService.eliminarEsquema(req.user.tenantId, id);
  }

  // ─── Asignaciones de esquema (afectación vigilador → puesto) ───

  @Post('asignaciones')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR')
  crearAsignacion(
    @Request() req: any,
    @Body() dto: CreateAsignacionEsquemaDto,
  ) {
    return this.cuadranteService.crearAsignacionEsquema(req.user.tenantId, dto);
  }

  @Get('asignaciones')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR', 'OPERADOR')
  listarAsignaciones(
    @Request() req: any,
    @Query('objetivoId') objetivoId: string,
  ) {
    if (!objetivoId) {
      throw new BadRequestException('Parámetro "objetivoId" obligatorio');
    }
    return this.cuadranteService.listarAsignacionesPorObjetivo(
      req.user.tenantId,
      objetivoId,
    );
  }

  @Post('asignaciones/:id/finalizar')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR')
  finalizarAsignacion(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { vigente_hasta: string },
  ) {
    if (!body?.vigente_hasta) {
      throw new BadRequestException('Campo "vigente_hasta" obligatorio');
    }
    return this.cuadranteService.finalizarAsignacionEsquema(
      req.user.tenantId,
      id,
      new Date(body.vigente_hasta),
    );
  }

  // ─── Cobertura por puesto ───

  @Put('puestos/:puestoId/cobertura')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR')
  upsertCobertura(
    @Request() req: any,
    @Param('puestoId') puestoId: string,
    @Body() dto: UpsertPuestoCoberturaDto,
  ) {
    return this.cuadranteService.upsertCobertura(
      req.user.tenantId,
      puestoId,
      dto,
    );
  }

  @Get('puestos/:puestoId/cobertura')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR', 'OPERADOR')
  obtenerCobertura(@Request() req: any, @Param('puestoId') puestoId: string) {
    return this.cuadranteService.obtenerCobertura(req.user.tenantId, puestoId);
  }

  // ─── Vista agregada de cuadrante por objetivo ───

  @Get('objetivos/:objetivoId')
  @Roles('ADMIN', 'GERENCIA', 'SUPERVISOR', 'OPERADOR')
  cuadranteDeObjetivo(
    @Request() req: any,
    @Param('objetivoId') objetivoId: string,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    if (!desde || !hasta) {
      throw new BadRequestException(
        'Parámetros "desde" y "hasta" obligatorios',
      );
    }
    return this.cuadranteService.cuadranteDeObjetivo(
      req.user.tenantId,
      objetivoId,
      new Date(desde),
      new Date(hasta),
    );
  }
}

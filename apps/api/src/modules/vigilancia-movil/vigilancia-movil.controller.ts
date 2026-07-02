import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VigilanciaMovilService } from './vigilancia-movil.service';
import { VigiladorJwtGuard } from '../vigilante-auth/vigilador-jwt.guard';
import { RelevosService } from '../relevos/relevos.service';
import { SolicitarRelevoDto } from '../relevos/dto/solicitar-relevo.dto';

/**
 * Endpoints de la app del guardia. Funciona en dos modos según el token:
 *  - VIGILADOR: login personal (legajo+PIN); el vigilador sale del token.
 *  - DISPOSITIVO: un celular por objetivo; el vigilador se identifica por acción
 *    y viaja en el payload (data.vigiladorId / query vigiladorId), validado
 *    contra el objetivo del dispositivo en resolverVigilador().
 */
@Controller('mobile')
@UseGuards(VigiladorJwtGuard)
export class VigilanciaMovilController {
  constructor(
    private readonly mobileService: VigilanciaMovilService,
    private readonly relevosService: RelevosService,
  ) {}

  /** Vigiladores asignados al objetivo del dispositivo (selector "¿Quién sos?"). */
  @Get('objetivo/vigiladores')
  async vigiladoresDelObjetivo(@Request() req: any) {
    return this.mobileService.vigiladoresDelObjetivo(
      req.user.tenantId,
      req.user.objetivoId,
    );
  }

  @Post('checkpoint')
  async scanCheckpoint(
    @Body()
    data: {
      checkpointId: string;
      location?: any;
      clientEventId?: string;
      ts?: string;
      vigiladorId?: string;
    },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      data.vigiladorId,
    );
    return this.mobileService.registrarPuntoControl(
      req.user.tenantId,
      vigiladorId,
      data.checkpointId,
      data.location,
      data.clientEventId,
      data.ts,
    );
  }

  @Post('panic')
  async triggerPanic(
    @Body()
    data: {
      location: { lat: number; lng: number };
      clientEventId?: string;
      ts?: string;
      vigiladorId?: string;
    },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      data.vigiladorId,
    );
    return this.mobileService.dispararPanico(
      vigiladorId,
      req.user.tenantId,
      data.location,
      data.clientEventId,
      data.ts,
      req.user.objetivoId,
    );
  }

  @Post('tracking')
  async updateLocation(
    @Body() data: { location: { lat: number; lng: number }; vigiladorId?: string },
    @Request() req: any,
  ) {
    // El tracking no exige identificación: si no hay vigilador (dispositivo sin
    // seleccionar), se reporta el objetivo igual para el mapa en vivo.
    const vigiladorId =
      req.user.tipo === 'VIGILADOR' ? req.user.vigiladorId : data.vigiladorId;
    return this.mobileService.updateLocation(
      vigiladorId,
      req.user.tenantId,
      data.location,
      req.user.objetivoId,
    );
  }

  @Get('turno-actual')
  async turnoActual(@Request() req: any, @Query('vigiladorId') vigiladorId?: string) {
    const actor = await this.mobileService.resolverVigilador(req.user, vigiladorId);
    return this.mobileService.turnoActual(req.user.tenantId, actor);
  }

  @Get('rondas')
  async rondas(@Request() req: any, @Query('vigiladorId') vigiladorId?: string) {
    const actor = await this.mobileService.resolverVigilador(req.user, vigiladorId);
    return this.mobileService.rondasDelTurno(req.user.tenantId, actor);
  }

  @Post('rondas/iniciar')
  async iniciarRonda(
    @Body()
    data: {
      plantillaId: string;
      clientEventId?: string;
      ts?: string;
      vigiladorId?: string;
    },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      data.vigiladorId,
    );
    return this.mobileService.iniciarRonda(
      req.user.tenantId,
      vigiladorId,
      data.plantillaId,
      data.clientEventId,
      data.ts,
    );
  }

  @Post('asistencia/checkin')
  async checkin(
    @Body()
    data: {
      turnoId: string;
      metodo: string;
      location?: { lat: number; lng: number };
      clientEventId?: string;
      ts?: string;
      vigiladorId?: string;
    },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      data.vigiladorId,
    );
    return this.mobileService.checkin(
      req.user.tenantId,
      vigiladorId,
      data.turnoId,
      data.metodo,
      data.location,
      data.clientEventId,
      data.ts,
    );
  }

  @Post('asistencia/checkout')
  async checkout(
    @Body()
    data: {
      turnoId: string;
      metodo: string;
      location?: { lat: number; lng: number };
      clientEventId?: string;
      ts?: string;
      vigiladorId?: string;
    },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      data.vigiladorId,
    );
    return this.mobileService.checkout(
      req.user.tenantId,
      vigiladorId,
      data.turnoId,
      data.metodo,
      data.location,
      data.clientEventId,
      data.ts,
    );
  }

  @Get('novedad-tipos')
  async novedadTipos(@Request() req: any) {
    return this.mobileService.listarNovedadTipos(req.user.tenantId);
  }

  @Post('novedades')
  @UseInterceptors(FilesInterceptor('media', 3))
  async crearNovedad(
    @UploadedFiles()
    media: Array<{
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    }> = [],
    @Body()
    data: {
      tipo: string;
      descripcion: string;
      prioridad?: string;
      clientEventId?: string;
      ts?: string;
      vigiladorId?: string;
    },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      data.vigiladorId,
    );
    return this.mobileService.crearNovedad(
      req.user.tenantId,
      vigiladorId,
      data,
      media ?? [],
    );
  }

  @Post('relevos')
  async solicitarRelevo(
    @Body() dto: SolicitarRelevoDto & { vigiladorId?: string },
    @Request() req: any,
  ) {
    const vigiladorId = await this.mobileService.resolverVigilador(
      req.user,
      dto.vigiladorId,
    );
    return this.relevosService.solicitar(req.user.tenantId, vigiladorId, dto);
  }
}

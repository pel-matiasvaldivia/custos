import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  Header,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PtzDto } from './dto/dispositivo.dto';

@Controller('centro-operaciones/video')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  /** Prepara el stream on-demand y devuelve las URLs proxeadas + snapshot. */
  @Get('stream/:incidentId')
  async getStream(@Param('incidentId') incidentId: string, @Req() req: any) {
    return this.videoService.getStreamForIncident(
      incidentId,
      req.user.tenantId,
    );
  }

  /** Señalización WHEP: recibe el SDP offer del navegador, devuelve el answer. */
  @Post('whep/:incidentId')
  @Header('Content-Type', 'application/sdp')
  async whep(
    @Param('incidentId') incidentId: string,
    @Req() req: Request & { user: any },
    @Res() res: Response,
  ) {
    // El body es el SDP crudo (text/plain o application/sdp).
    const offer =
      typeof req.body === 'string' ? req.body : (req.body?.sdp ?? '');
    const answer = await this.videoService.whep(
      incidentId,
      req.user.tenantId,
      offer,
    );
    res.send(answer);
  }

  /** Snapshot del instante del disparo (JPEG). */
  @Get('snapshot/:incidentId')
  async snapshot(
    @Param('incidentId') incidentId: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { stream, contentType } = await this.videoService.snapshot(
      incidentId,
      req.user.tenantId,
    );
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    stream.pipe(res);
  }

  /** PTZ de la cámara del incidente. */
  @Post('ptz/:incidentId')
  async ptz(
    @Param('incidentId') incidentId: string,
    @Body() mov: PtzDto,
    @Req() req: any,
  ) {
    return this.videoService.ptzDesdeIncidente(
      incidentId,
      req.user.tenantId,
      mov,
    );
  }
}

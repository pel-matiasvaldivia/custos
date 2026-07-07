import {
  Controller,
  Post,
  Param,
  Body,
  Req,
  UploadedFiles,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { HikvisionService } from './hikvision.service';
import { CentroOperacionesService } from '../centro-operaciones.service';
import { TenantContextService } from '../../../common/context/tenant-context.service';

/**
 * Receptor del Alarm Server de Hikvision. El equipo (DVR/NVR/cámara) empuja el
 * evento acá; no puede autenticar con JWT, así que la autorización es el token
 * único de ingesta en la URL. Igual patrón que el receptor SIA: resolvemos el
 * dispositivo→tenant con el cliente admin y procesamos DENTRO del contexto del
 * tenant resuelto para respetar RLS.
 *
 * SIN JwtAuthGuard a propósito. En producción va detrás del proxy con rate-limit.
 */
@Controller('centro-operaciones/hik')
export class HikController {
  private readonly logger = new Logger(HikController.name);

  constructor(
    private readonly hik: HikvisionService,
    private readonly coService: CentroOperacionesService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Post('eventos/:token')
  @UseInterceptors(AnyFilesInterceptor())
  async recibir(
    @Param('token') token: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Req() req: Request,
  ) {
    const disp = await this.hik.resolverPorToken(token);

    const archivos = (files || []).map((f) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      buffer: f.buffer,
    }));

    // Cuerpo crudo cuando no es multipart (algunos equipos POSTean XML directo).
    const payload =
      body && Object.keys(body || {}).length
        ? body
        : (req as any).rawBody
          ? (req as any).rawBody.toString('utf8')
          : body;

    const eventos = await this.hik.normalizar(disp, payload, archivos);

    await this.tenantContext.run(disp.tenant_id, async () => {
      for (const ev of eventos) {
        await this.coService.processEvent(ev);
      }
      // Sin eventos (heartbeat): igual actualizamos el latido del equipo.
      if (eventos.length === 0) {
        await this.coService.marcarLatido(disp.id);
      }
    });

    return { ok: true, procesados: eventos.length };
  }
}

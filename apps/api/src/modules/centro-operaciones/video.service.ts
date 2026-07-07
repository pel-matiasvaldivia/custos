import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Readable } from 'stream';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { HikvisionService } from './hikvision/hikvision.service';
import { SecretosService } from '../../common/crypto/secretos.service';
import { StorageService } from '../../storage/storage.service';

/**
 * Video verificación del Centro de Operaciones.
 *
 * Principios (ver MODELO_INTEGRACION_HIKVISION.md):
 *  - **Bajo demanda**: el path en MediaMTX se registra con `sourceOnDemand`; la
 *    cámara solo se toca cuando el operador abre el player y se suelta al cerrar.
 *  - **Seguro por tenant**: todo se resuelve con PrismaService (RLS); el nombre
 *    del path va namespaceado por tenant. MediaMTX no se expone al navegador: la
 *    señalización WHEP se proxea por la API con JWT.
 *  - **Snapshot primero**: la verificación arranca con el JPEG del instante.
 */
@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly MEDIAMTX_API =
    process.env.MEDIAMTX_API || 'http://mediamtx:9997/v3';
  private readonly MEDIAMTX_WHEP =
    process.env.MEDIAMTX_WHEP || 'http://mediamtx:8889';

  constructor(
    private readonly prisma: PrismaService,
    private readonly hik: HikvisionService,
    private readonly secretos: SecretosService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Resuelve la cámara del incidente ("la que disparó, según la configuración")
   * y prepara el stream bajo demanda. Devuelve las URLs proxeadas que consume el
   * operador (nunca las de MediaMTX directo).
   */
  async getStreamForIncident(incidentId: string, tenantId: string) {
    const ctx = await this.resolverCanal(incidentId, tenantId);
    if (!ctx) {
      // Sin cámara mapeada: el frontend ofrece elegir manualmente.
      return {
        disponible: false,
        canales: await this.canalesDelObjetivo(incidentId, tenantId),
      };
    }

    const pathId = this.pathId(tenantId, ctx.dispositivoId, ctx.numeroCanal);
    const rtsp = this.armarRtsp(ctx);
    await this.registrarPathOnDemand(pathId, rtsp);

    return {
      disponible: true,
      canal: ctx.nombre ?? `Canal ${ctx.numeroCanal}`,
      canalId: ctx.canalId,
      dispositivoId: ctx.dispositivoId,
      numeroCanal: ctx.numeroCanal,
      tienePtz: ctx.tienePtz,
      snapshotUrl: `/centro-operaciones/video/snapshot/${incidentId}`,
      whepUrl: `/centro-operaciones/video/whep/${incidentId}`,
    };
  }

  /** Proxy de la señalización WHEP: reenvía el SDP offer a MediaMTX y devuelve el answer. */
  async whep(incidentId: string, tenantId: string, sdpOffer: string) {
    const ctx = await this.resolverCanal(incidentId, tenantId);
    if (!ctx) throw new NotFoundException('Sin cámara para este incidente');
    const pathId = this.pathId(tenantId, ctx.dispositivoId, ctx.numeroCanal);
    await this.registrarPathOnDemand(pathId, this.armarRtsp(ctx));

    const { data } = await axios.post(
      `${this.MEDIAMTX_WHEP}/${pathId}/whep`,
      sdpOffer,
      {
        headers: { 'Content-Type': 'application/sdp' },
        responseType: 'text',
        timeout: 10000,
      },
    );
    return data as string;
  }

  /** Sirve el snapshot del incidente: el guardado en el evento o uno en vivo. */
  async snapshot(
    incidentId: string,
    tenantId: string,
  ): Promise<{ stream: Readable; contentType: string }> {
    const evento = await this.ultimoEventoConSnapshot(incidentId, tenantId);
    if (evento?.snapshot_key) {
      return this.storage.descargar(evento.snapshot_key);
    }
    // Sin snapshot guardado: intentar capturar en vivo.
    const ctx = await this.resolverCanal(incidentId, tenantId);
    if (ctx) {
      const disp = await this.prisma.dispositivo.findFirst({
        where: { id: ctx.dispositivoId },
      });
      const jpeg = await this.hik
        .clientePara(disp)
        .snapshot(ctx.numeroCanal)
        .catch(() => null);
      if (jpeg) {
        return { stream: Readable.from(jpeg), contentType: 'image/jpeg' };
      }
    }
    throw new NotFoundException('Sin snapshot disponible');
  }

  /** PTZ sobre la cámara del incidente. */
  async ptzDesdeIncidente(
    incidentId: string,
    tenantId: string,
    mov: { pan?: number; tilt?: number; zoom?: number },
  ) {
    const ctx = await this.resolverCanal(incidentId, tenantId);
    if (!ctx) throw new NotFoundException('Sin cámara para este incidente');
    if (!ctx.tienePtz) throw new BadRequestException('El canal no tiene PTZ');
    const disp = await this.prisma.dispositivo.findFirst({
      where: { id: ctx.dispositivoId },
    });
    await this.hik.clientePara(disp).ptzContinuous(ctx.numeroCanal, mov);
    return { ok: true };
  }

  // --- Resolución de la cámara ----------------------------------------------

  private async resolverCanal(incidentId: string, tenantId: string) {
    const incidente = await this.prisma.incidente.findFirst({
      where: { id: incidentId, tenant_id: tenantId },
      select: { id: true },
    });
    if (!incidente) throw new NotFoundException('Incidente inexistente');

    // Último evento del incidente con info de cámara/zona.
    const evento = await this.prisma.evento.findFirst({
      where: { incidente_id: incidentId },
      orderBy: { ts_evento: 'desc' },
      select: {
        dispositivo_id: true,
        canal_numero: true,
        zona_id: true,
      },
    });
    if (!evento) return null;

    // Caso 1: evento nativo de cámara (trae su canal).
    if (evento.canal_numero != null) {
      const canal = await this.prisma.dispositivoCanal.findFirst({
        where: {
          dispositivo_id: evento.dispositivo_id,
          numero_canal: evento.canal_numero,
        },
      });
      return this.contexto(evento.dispositivo_id, evento.canal_numero, canal);
    }

    // Caso 2: evento de panel/zona → canal mapeado (puede ser otro NVR).
    if (evento.zona_id) {
      const zona = await this.prisma.zona.findFirst({
        where: { id: evento.zona_id },
        include: { canal: true },
      });
      if (zona?.canal) {
        return this.contexto(
          zona.canal.dispositivo_id,
          zona.canal.numero_canal,
          zona.canal,
        );
      }
    }
    return null;
  }

  private async contexto(
    dispositivoId: string,
    numeroCanal: number,
    canal: {
      id?: string;
      nombre?: string | null;
      rtsp_path?: string | null;
      tiene_ptz?: boolean;
    } | null,
  ) {
    const disp = await this.prisma.dispositivo.findFirst({
      where: { id: dispositivoId },
    });
    if (!disp) return null;
    return {
      dispositivoId,
      numeroCanal,
      canalId: canal?.id ?? null,
      nombre: canal?.nombre ?? null,
      rtspPath: canal?.rtsp_path ?? null,
      tienePtz: !!canal?.tiene_ptz,
      params: (disp.params || {}) as Record<string, any>,
    };
  }

  private async canalesDelObjetivo(incidentId: string, tenantId: string) {
    const inc = await this.prisma.incidente.findFirst({
      where: { id: incidentId, tenant_id: tenantId },
      select: { objetivo_id: true },
    });
    if (!inc) return [];
    return this.prisma.dispositivoCanal.findMany({
      where: {
        tenant_id: tenantId,
        habilitado: true,
        dispositivo: { objetivo_id: inc.objetivo_id },
      },
      select: {
        id: true,
        numero_canal: true,
        nombre: true,
        dispositivo_id: true,
      },
      orderBy: { numero_canal: 'asc' },
    });
  }

  private async ultimoEventoConSnapshot(incidentId: string, tenantId: string) {
    // Valida tenant vía RLS al leer el incidente.
    const inc = await this.prisma.incidente.findFirst({
      where: { id: incidentId, tenant_id: tenantId },
      select: { id: true },
    });
    if (!inc) throw new NotFoundException('Incidente inexistente');
    return this.prisma.evento.findFirst({
      where: { incidente_id: incidentId, snapshot_key: { not: null } },
      orderBy: { ts_evento: 'desc' },
      select: { snapshot_key: true },
    });
  }

  // --- MediaMTX + RTSP ------------------------------------------------------

  private armarRtsp(ctx: {
    numeroCanal: number;
    rtspPath: string | null;
    params: Record<string, any>;
  }): string {
    const p = ctx.params;
    const usuario = encodeURIComponent(p.usuario || '');
    const pass = encodeURIComponent(
      p.secreto ? this.secretos.descifrar(p.secreto) : '',
    );
    const puerto = p.puerto_rtsp || 554;
    const auth = usuario ? `${usuario}:${pass}@` : '';
    // Sub-stream (canalXX02) para verificar: menor bitrate, arranca más rápido.
    const ruta = ctx.rtspPath || `/Streaming/Channels/${ctx.numeroCanal}02`;
    return `rtsp://${auth}${p.ip}:${puerto}${ruta}`;
  }

  private pathId(
    tenantId: string,
    dispositivoId: string,
    canal: number,
  ): string {
    const short = (s: string) => s.replace(/-/g, '').slice(0, 12);
    return `t_${short(tenantId)}_dev_${short(dispositivoId)}_ch_${canal}`;
  }

  private async registrarPathOnDemand(pathId: string, rtsp: string) {
    try {
      await axios.post(
        `${this.MEDIAMTX_API}/config/paths/add/${pathId}`,
        {
          source: rtsp,
          sourceOnDemand: true,
          sourceOnDemandCloseAfter: '20s',
        },
        { timeout: 5000 },
      );
    } catch (e: any) {
      // 400/409 = el path ya existe: es esperable y no es error.
      const status = e?.response?.status;
      if (status !== 400 && status !== 409) {
        this.logger.warn(
          `No se pudo registrar el path ${pathId} en MediaMTX: ${
            e instanceof Error ? e.message : String(e)
          }`,
        );
      }
    }
  }
}

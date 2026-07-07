import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaAdminService } from '../../../prisma/prisma-admin.service';
import { SecretosService } from '../../../common/crypto/secretos.service';
import { StorageService } from '../../../storage/storage.service';
import { HikIsapiClient, HikConexion } from './hik-isapi.client';

interface ArchivoPush {
  fieldname?: string;
  originalname?: string;
  mimetype?: string;
  buffer: Buffer;
}

/**
 * Ingesta de eventos Hikvision (Alarm Server / HTTP Host). El equipo empuja el
 * evento a `/hik/eventos/:token`; acá se resuelve el equipo (cross-tenant, admin),
 * se normaliza a la taxonomía de `Evento` y se captura el snapshot del instante.
 * El alta del incidente la sigue haciendo `processEvent`, sin cambios.
 */
@Injectable()
export class HikvisionService {
  private readonly logger = new Logger(HikvisionService.name);

  // eventType Hikvision → { tipo, severidad, origen }
  private static readonly MAPA: Record<
    string,
    { tipo: string; severidad: string; origen: string }
  > = {
    linedetection: { tipo: 'INTRUSION', severidad: 'ALTA', origen: 'CCTV' },
    fielddetection: { tipo: 'INTRUSION', severidad: 'ALTA', origen: 'CCTV' },
    regionentrance: { tipo: 'INTRUSION', severidad: 'ALTA', origen: 'CCTV' },
    regionexiting: { tipo: 'INTRUSION', severidad: 'ALTA', origen: 'CCTV' },
    vmd: { tipo: 'MOVIMIENTO', severidad: 'MEDIA', origen: 'CCTV' },
    tamperdetection: { tipo: 'TAMPER', severidad: 'ALTA', origen: 'CCTV' },
    shelteralarm: { tipo: 'TAMPER', severidad: 'ALTA', origen: 'CCTV' },
    videoloss: { tipo: 'PERDIDA_VIDEO', severidad: 'ALTA', origen: 'CCTV' },
    pir: { tipo: 'INTRUSION', severidad: 'ALTA', origen: 'PANEL' },
    fire: { tipo: 'FUEGO', severidad: 'CRITICA', origen: 'PANEL' },
    io: { tipo: 'INTRUSION', severidad: 'ALTA', origen: 'PANEL' },
    diskfull: { tipo: 'TECNICA', severidad: 'BAJA', origen: 'SISTEMA' },
    diskerror: { tipo: 'TECNICA', severidad: 'BAJA', origen: 'SISTEMA' },
    ipconflict: { tipo: 'TECNICA', severidad: 'BAJA', origen: 'SISTEMA' },
  };

  constructor(
    private readonly prisma: PrismaAdminService,
    private readonly secretos: SecretosService,
    private readonly storage: StorageService,
  ) {}

  /** Resuelve el dispositivo (y su tenant) a partir del token de ingesta. */
  async resolverPorToken(token: string) {
    const disp = await this.prisma.dispositivo.findFirst({
      where: { ingest_token: token, deleted_at: null },
    });
    if (!disp) throw new NotFoundException('Token de ingesta inválido');
    return disp;
  }

  /**
   * Normaliza un push a uno o más eventos listos para `processEvent`. Un `heartBeat`
   * o keepalive devuelve `[]` (solo actualiza latido, que hace `processEvent` igual
   * si llega un evento; el heartbeat se maneja en el controller).
   */
  async normalizar(
    disp: any,
    body: any,
    archivos: ArchivoPush[] = [],
  ): Promise<any[]> {
    const payload = this.extraerPayload(body, archivos);
    if (!payload) return [];

    const eventTypeRaw =
      this.valor(payload, 'eventType') ||
      this.valor(payload, 'eventtype') ||
      '';
    const eventType = eventTypeRaw.toLowerCase();
    // heartbeat/keepalive puro: no genera evento (solo mantiene el latido).
    if (!eventType || eventType === 'heartbeat') return [];

    const mapa = HikvisionService.MAPA[eventType] ?? {
      tipo: 'GENERAL',
      severidad: 'MEDIA',
      origen: 'CCTV',
    };

    const canalStr =
      this.valor(payload, 'channelID') ||
      this.valor(payload, 'dynChannelID') ||
      this.valor(payload, 'channelid');
    const canal_numero = canalStr ? parseInt(canalStr, 10) : undefined;

    const dateTime =
      this.valor(payload, 'dateTime') || new Date().toISOString();
    const id_origen = `${eventType}:${canal_numero ?? 0}:${dateTime}`;

    // Snapshot: primero el que vino en el push; si no, se captura por ISAPI.
    const imagen = archivos.find((a) =>
      (a.mimetype || '').startsWith('image/'),
    );
    let snapshot_key: string | null = null;
    if (imagen) {
      snapshot_key = await this.subirSnapshot(disp, imagen.buffer);
    } else if (canal_numero != null && Number.isFinite(canal_numero)) {
      snapshot_key = await this.capturarSnapshot(disp, canal_numero);
    }

    // Zona: si el evento trae número de zona (IO/panel), se resuelve/crea.
    const zonaNum =
      this.valor(payload, 'zoneNo') || this.valor(payload, 'inputIONo');
    const zona_id = zonaNum ? await this.resolverZona(disp, zonaNum) : null;

    const enPrueba = !!disp.params?.en_prueba;

    return [
      {
        tenant_id: disp.tenant_id,
        objetivo_id: disp.objetivo_id,
        dispositivo_id: disp.id,
        zona_id,
        tipo: mapa.tipo,
        severidad: mapa.severidad,
        origen: mapa.origen,
        codigo_crudo: eventTypeRaw,
        canal_numero: Number.isFinite(canal_numero) ? canal_numero : null,
        snapshot_key,
        en_prueba: enPrueba,
        id_origen,
        crudo: typeof payload === 'object' ? payload : { raw: String(payload) },
      },
    ];
  }

  /** Captura un JPEG por ISAPI y lo sube a MinIO. Devuelve la key o null. */
  async capturarSnapshot(
    disp: any,
    numeroCanal: number,
  ): Promise<string | null> {
    try {
      const client = this.clientePara(disp);
      const jpeg = await client.snapshot(numeroCanal);
      return this.subirSnapshot(disp, jpeg);
    } catch (e) {
      this.logger.warn(`No se pudo capturar snapshot: ${msg(e)}`);
      return null;
    }
  }

  private async subirSnapshot(disp: any, jpeg: Buffer): Promise<string | null> {
    try {
      const { key } = await this.storage.subir(
        jpeg,
        `snap-${Date.now()}.jpg`,
        'image/jpeg',
        `snapshots/${disp.tenant_id}`,
      );
      return key;
    } catch (e) {
      this.logger.warn(`No se pudo subir snapshot: ${msg(e)}`);
      return null;
    }
  }

  /** Prueba de conexión con credenciales en claro (onboarding, sin persistir). */
  async probarConexion(conn: HikConexion) {
    return new HikIsapiClient(conn).deviceInfo();
  }

  /** Construye el cliente ISAPI con la contraseña descifrada de `params`. */
  clientePara(disp: any): HikIsapiClient {
    const p = (disp.params || {}) as Record<string, any>;
    const conn: HikConexion = {
      ip: p.ip,
      puertoHttp: p.puerto_http,
      usuario: p.usuario,
      password: p.secreto ? this.secretos.descifrar(p.secreto) : '',
      https: !!p.https,
    };
    return new HikIsapiClient(conn);
  }

  private async resolverZona(
    disp: any,
    numero: string,
  ): Promise<string | null> {
    const existente = await this.prisma.zona.findFirst({
      where: { dispositivo_id: disp.id, numero_zona: numero },
    });
    return existente?.id ?? null;
  }

  // --- Parsing del payload --------------------------------------------------

  private extraerPayload(body: any, archivos: ArchivoPush[]): any {
    // 1. Body JSON directo.
    if (body && typeof body === 'object' && Object.keys(body).length) {
      return body;
    }
    // 2. Body string (XML/JSON crudo).
    if (typeof body === 'string' && body.trim()) return body;
    // 3. Parte de texto en el multipart.
    const parte = archivos.find((a) => {
      const m = (a.mimetype || '').toLowerCase();
      return m.includes('json') || m.includes('xml') || m.includes('text');
    });
    return parte ? parte.buffer.toString('utf8') : null;
  }

  /** Lee un campo tanto de JSON (objeto) como de XML (string). */
  private valor(payload: any, key: string): string | undefined {
    if (payload && typeof payload === 'object') {
      const v = this.buscarProfundo(payload, key.toLowerCase());
      return v != null ? String(v) : undefined;
    }
    if (typeof payload === 'string') {
      const m = payload.match(new RegExp(`<${key}[^>]*>([^<]*)</${key}>`, 'i'));
      return m?.[1]?.trim();
    }
    return undefined;
  }

  private buscarProfundo(obj: any, keyLower: string): any {
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase() === keyLower) return obj[k];
      if (obj[k] && typeof obj[k] === 'object') {
        const v = this.buscarProfundo(obj[k], keyLower);
        if (v != null) return v;
      }
    }
    return null;
  }
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

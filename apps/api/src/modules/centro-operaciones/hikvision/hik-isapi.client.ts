import { Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Cliente ISAPI de Hikvision con autenticación **Digest** (HTTP RFC 2617), que es
 * lo que exigen los DVR/NVR/cámaras Hikvision. No usamos librerías externas: el
 * digest se arma con `crypto`. Un primer request recibe el 401 con el challenge
 * (`WWW-Authenticate`), y se reintenta con el header `Authorization: Digest ...`.
 *
 * No lanza en el primer 401 (es parte del handshake); sí propaga otros errores.
 */
export interface HikConexion {
  ip: string;
  puertoHttp?: number;
  usuario: string;
  password: string;
  https?: boolean;
}

export interface HikDeviceInfo {
  deviceName?: string;
  model?: string;
  serialNumber?: string;
  firmwareVersion?: string;
}

export interface HikCanal {
  numero: number;
  nombre?: string;
  tienePtz?: boolean;
}

export class HikIsapiClient {
  private readonly logger = new Logger(HikIsapiClient.name);
  private readonly baseUrl: string;

  constructor(private readonly conn: HikConexion) {
    const scheme = conn.https ? 'https' : 'http';
    const port = conn.puertoHttp ?? (conn.https ? 443 : 80);
    this.baseUrl = `${scheme}://${conn.ip}:${port}`;
  }

  /** GET /ISAPI/System/deviceInfo — prueba de conexión + identidad del equipo. */
  async deviceInfo(): Promise<HikDeviceInfo> {
    const { data } = await this.request('GET', '/ISAPI/System/deviceInfo');
    const xml = String(data);
    return {
      deviceName: this.tag(xml, 'deviceName'),
      model: this.tag(xml, 'model'),
      serialNumber: this.tag(xml, 'serialNumber'),
      firmwareVersion: this.tag(xml, 'firmwareVersion'),
    };
  }

  /**
   * Descubre los canales de video. En un NVR los canales son cámaras dadas de
   * alta (InputProxy); en un DVR/cámara IP se listan los canales de streaming.
   * Se intenta InputProxy primero y se cae a Streaming/channels.
   */
  async descubrirCanales(): Promise<HikCanal[]> {
    const intentos = [
      '/ISAPI/ContentMgmt/InputProxy/channels',
      '/ISAPI/Streaming/channels',
    ];
    for (const ruta of intentos) {
      try {
        const { data } = await this.request('GET', ruta);
        const canales = this.parseCanales(String(data));
        if (canales.length) return canales;
      } catch (e) {
        this.logger.debug(`Descubrimiento por ${ruta} falló: ${msg(e)}`);
      }
    }
    return [];
  }

  /** GET picture del canal (JPEG) — snapshot del instante para verificación. */
  async snapshot(numeroCanal: number): Promise<Buffer> {
    const ruta = `/ISAPI/Streaming/channels/${numeroCanal}01/picture`;
    const { data } = await this.request('GET', ruta, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(data as ArrayBuffer);
  }

  /**
   * Control PTZ continuo. pan/tilt/zoom en [-100,100]; enviar 0 en los tres
   * detiene el movimiento (comando `stop`).
   */
  async ptzContinuous(
    numeroCanal: number,
    v: { pan?: number; tilt?: number; zoom?: number },
  ): Promise<void> {
    const body =
      `<PTZData><pan>${v.pan ?? 0}</pan>` +
      `<tilt>${v.tilt ?? 0}</tilt>` +
      `<zoom>${v.zoom ?? 0}</zoom></PTZData>`;
    await this.request(
      'PUT',
      `/ISAPI/PTZCtrl/channels/${numeroCanal}/continuous`,
      { data: body, headers: { 'Content-Type': 'application/xml' } },
    );
  }

  /**
   * Configura el Alarm Server (HTTP Host) del equipo para que empuje los eventos
   * a nuestra URL de ingesta. `id` = 1 es el host primario en la mayoría de los
   * modelos. `destino` es la URL absoluta de nuestro receptor.
   */
  async configurarAlarmServer(destino: string): Promise<void> {
    const u = new URL(destino);
    const puerto = u.port || (u.protocol === 'https:' ? '443' : '80');
    const body =
      `<HttpHostNotification><id>1</id>` +
      `<url>${u.pathname}${u.search}</url>` +
      `<protocolType>${u.protocol === 'https:' ? 'HTTPS' : 'HTTP'}</protocolType>` +
      `<parameterFormatType>XML</parameterFormatType>` +
      `<addressingFormatType>ipaddress</addressingFormatType>` +
      `<ipAddress>${u.hostname}</ipAddress>` +
      `<portNo>${puerto}</portNo>` +
      `<httpAuthenticationMethod>none</httpAuthenticationMethod>` +
      `</HttpHostNotification>`;
    await this.request('PUT', '/ISAPI/Event/notification/httpHosts/1', {
      data: body,
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  // --- Digest handshake -----------------------------------------------------

  private async request(
    method: 'GET' | 'PUT' | 'POST',
    path: string,
    extra: AxiosRequestConfig = {},
  ): Promise<AxiosResponse> {
    const url = `${this.baseUrl}${path}`;
    const cfg: AxiosRequestConfig = {
      method,
      url,
      timeout: 8000,
      // No lanzar en 401: es el primer paso del digest.
      validateStatus: (s) => s < 500,
      ...extra,
    };

    const first = await axios.request(cfg);
    if (first.status !== 401) return this.assertOk(first);

    const challenge = first.headers['www-authenticate'];
    if (!challenge || !/digest/i.test(challenge)) {
      // Algunos equipos aceptan Basic; último recurso.
      const basic = Buffer.from(
        `${this.conn.usuario}:${this.conn.password}`,
      ).toString('base64');
      const retry = await axios.request({
        ...cfg,
        headers: { ...(cfg.headers || {}), Authorization: `Basic ${basic}` },
      });
      return this.assertOk(retry);
    }

    const auth = this.buildDigest(challenge, method, path);
    const retry = await axios.request({
      ...cfg,
      headers: { ...(cfg.headers || {}), Authorization: auth },
    });
    return this.assertOk(retry);
  }

  private assertOk(res: AxiosResponse): AxiosResponse {
    if (res.status >= 400) {
      throw new Error(`ISAPI ${res.config.url} respondió ${res.status}`);
    }
    return res;
  }

  private buildDigest(challenge: string, method: string, uri: string): string {
    const realm = this.field(challenge, 'realm') ?? '';
    const nonce = this.field(challenge, 'nonce') ?? '';
    const qop = this.field(challenge, 'qop');
    const opaque = this.field(challenge, 'opaque');
    const { usuario, password } = this.conn;

    const ha1 = md5(`${usuario}:${realm}:${password}`);
    const ha2 = md5(`${method}:${uri}`);

    let response: string;
    let extra = '';
    if (qop) {
      const nc = '00000001';
      const cnonce = randomBytes(8).toString('hex');
      response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
      extra = `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
    } else {
      response = md5(`${ha1}:${nonce}:${ha2}`);
    }

    let header =
      `Digest username="${usuario}", realm="${realm}", nonce="${nonce}", ` +
      `uri="${uri}", response="${response}"${extra}`;
    if (opaque) header += `, opaque="${opaque}"`;
    return header;
  }

  private field(header: string, key: string): string | undefined {
    const m = header.match(new RegExp(`${key}="?([^",]+)"?`, 'i'));
    return m?.[1];
  }

  // --- Parsers XML mínimos --------------------------------------------------

  private tag(xml: string, name: string): string | undefined {
    const m = xml.match(new RegExp(`<${name}[^>]*>([^<]*)</${name}>`, 'i'));
    return m?.[1]?.trim();
  }

  private parseCanales(xml: string): HikCanal[] {
    const canales: HikCanal[] = [];
    // Cada canal viene como <...Channel> con <id> y <name>/<...Description>.
    const bloques =
      xml.match(/<[A-Za-z]*Channel\b[\s\S]*?<\/[A-Za-z]*Channel>/g) || [];
    for (const b of bloques) {
      const id = this.tag(b, 'id') || this.tag(b, 'channelID');
      if (!id) continue;
      const numero = parseInt(id, 10);
      if (!Number.isFinite(numero)) continue;
      canales.push({
        numero,
        nombre: this.tag(b, 'name') || this.tag(b, 'chanName'),
        tienePtz: /ptz/i.test(b),
      });
    }
    return canales;
  }
}

function md5(s: string): string {
  return createHash('md5').update(s).digest('hex');
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

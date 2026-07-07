import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import axios from 'axios';
import Redis from 'ioredis';
import { ArcaConfigService, CredencialesArca } from './arca-config.service';
import {
  WSAA_URL,
  WSAA_SERVICE,
  TA_TTL_SEGUNDOS,
  AmbienteArca,
} from '../arca.constants';
import { TicketAcceso } from '../arca.types';

const execFileAsync = promisify(execFile);

/**
 * WSAA: obtiene el Ticket de Acceso (Token + Sign) que autoriza a facturar.
 *
 * El flujo de ARCA es: (1) armar un TRA XML, (2) firmarlo como CMS/PKCS#7 con el
 * certificado y la clave privada de la empresa, (3) enviarlo a LoginCms. El TA
 * dura 12 h, así que lo cacheamos en Redis por tenant+ambiente para no re-firmar
 * ni re-autenticar en cada factura (respaldo en DB por si Redis no está).
 */
@Injectable()
export class WsaaService {
  private readonly logger = new Logger(WsaaService.name);
  private redis: Redis | null = null;

  constructor(private config: ArcaConfigService) {}

  private getRedis(): Redis | null {
    if (this.redis) return this.redis;
    try {
      this.redis = process.env.REDIS_URL
        ? new Redis(process.env.REDIS_URL, {
            lazyConnect: false,
            maxRetriesPerRequest: 2,
          })
        : new Redis({
            host: process.env.REDIS_HOST || 'redis',
            port: Number(process.env.REDIS_PORT || 6379),
            maxRetriesPerRequest: 2,
          });
      // Sin este handler, un error de conexión de ioredis se vuelve un unhandled
      // rejection que puede tumbar el proceso; acá lo degradamos a warning.
      this.redis.on('error', (e) =>
        this.logger.warn(`Redis no disponible para cache de TA: ${e.message}`),
      );
    } catch (e) {
      this.logger.warn(`No se pudo inicializar Redis: ${msg(e)}`);
      this.redis = null;
    }
    return this.redis;
  }

  private claveCache(tenantId: string, ambiente: AmbienteArca): string {
    return `arca:ta:${tenantId}:${ambiente}`;
  }

  /** Devuelve un TA vigente, reusando el cache si todavía no venció. */
  async obtenerTicket(tenantId: string): Promise<TicketAcceso> {
    const cred = await this.config.obtenerCredenciales(tenantId);
    const clave = this.claveCache(tenantId, cred.ambiente);

    const cacheado = await this.leerCache(clave);
    if (cacheado && cacheado.expira > Date.now() + 60_000) return cacheado;

    // Respaldo en DB (Redis pudo haberse reiniciado y perdido la key).
    const respaldo = await this.config.obtenerTicketRespaldo(tenantId);
    if (respaldo && respaldo.expira > Date.now() + 60_000) {
      await this.escribirCache(clave, respaldo);
      return respaldo;
    }

    const ta = await this.autenticar(cred);
    await this.escribirCache(clave, ta);
    await this.config.guardarTicket(tenantId, ta).catch((e) => {
      this.logger.warn(`No se pudo respaldar el TA en DB: ${msg(e)}`);
    });
    return ta;
  }

  private async leerCache(clave: string): Promise<TicketAcceso | null> {
    const redis = this.getRedis();
    if (!redis) return null;
    try {
      const raw = await redis.get(clave);
      return raw ? (JSON.parse(raw) as TicketAcceso) : null;
    } catch (e) {
      this.logger.warn(`Fallo al leer TA de Redis: ${msg(e)}`);
      return null;
    }
  }

  private async escribirCache(clave: string, ta: TicketAcceso): Promise<void> {
    const redis = this.getRedis();
    if (!redis) return;
    try {
      await redis.set(clave, JSON.stringify(ta), 'EX', TA_TTL_SEGUNDOS);
    } catch (e) {
      this.logger.warn(`Fallo al cachear TA en Redis: ${msg(e)}`);
    }
  }

  /** Arma el TRA, lo firma (CMS) y llama a LoginCms. */
  private async autenticar(cred: CredencialesArca): Promise<TicketAcceso> {
    const tra = this.armarTra();
    const cms = await this.firmarCms(tra, cred);
    const respuesta = await this.llamarLoginCms(cms, cred.ambiente);
    return this.parsearTa(respuesta);
  }

  private armarTra(): string {
    const ahora = Date.now();
    // Ventana de validez holgada respecto al reloj de ARCA: -10 min / +10 min.
    const desde = new Date(ahora - 10 * 60_000).toISOString();
    const hasta = new Date(ahora + 10 * 60_000).toISOString();
    const uniqueId = Math.floor(ahora / 1000);
    return `<?xml version="1.0" encoding="UTF-8"?>
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>${uniqueId}</uniqueId>
    <generationTime>${desde}</generationTime>
    <expirationTime>${hasta}</expirationTime>
  </header>
  <service>${WSAA_SERVICE}</service>
</loginTicketRequest>`;
  }

  /**
   * Firma CMS/PKCS#7 con openssl. Se escriben el TRA, el certificado y la clave a
   * un directorio temporal con permisos restrictivos (0700/0600) y se borran en
   * el finally: openssl necesita rutas de archivo para todos sus insumos (el
   * `execFile` asíncrono no soporta pasar la entrada por stdin).
   */
  private async firmarCms(
    tra: string,
    cred: CredencialesArca,
  ): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), 'arca-'), { mode: 0o700 } as any);
    const traPath = join(dir, 'tra.xml');
    const certPath = join(dir, 'cert.pem');
    const keyPath = join(dir, 'key.pem');
    try {
      await writeFile(traPath, tra, { mode: 0o600 });
      await writeFile(certPath, cred.certificadoPem, { mode: 0o600 });
      await writeFile(keyPath, cred.clavePem, { mode: 0o600 });
      const { stdout } = await execFileAsync(
        'openssl',
        [
          'cms',
          '-sign',
          '-in',
          traPath,
          '-signer',
          certPath,
          '-inkey',
          keyPath,
          '-nodetach',
          '-outform',
          'DER',
        ],
        { encoding: 'buffer', maxBuffer: 4 * 1024 * 1024 } as any,
      );
      return (stdout as unknown as Buffer).toString('base64');
    } catch (e) {
      this.logger.error(`Fallo al firmar el TRA con openssl: ${msg(e)}`);
      throw new ServiceUnavailableException(
        'No se pudo firmar la solicitud de acceso a ARCA. Verificá que el certificado y la clave sean correctos.',
      );
    } finally {
      await rm(dir, { recursive: true, force: true }).catch(() => undefined);
    }
  }

  private async llamarLoginCms(
    cms: string,
    ambiente: AmbienteArca,
  ): Promise<string> {
    const soap = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov">
  <soapenv:Header/>
  <soapenv:Body>
    <wsaa:loginCms>
      <wsaa:in0>${cms}</wsaa:in0>
    </wsaa:loginCms>
  </soapenv:Body>
</soapenv:Envelope>`;
    try {
      const { data } = await axios.post(WSAA_URL[ambiente], soap, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: '',
        },
        timeout: 20_000,
      });
      return typeof data === 'string' ? data : String(data);
    } catch (e) {
      const detalle = extraerFault(e) ?? msg(e);
      this.logger.error(`Fallo en LoginCms (WSAA): ${detalle}`);
      throw new ServiceUnavailableException(
        `ARCA rechazó la autenticación: ${detalle}`,
      );
    }
  }

  private parsearTa(xmlSoap: string): TicketAcceso {
    // loginCmsReturn trae el TA como XML escapado (o en CDATA). Lo desescapamos
    // y extraemos token/sign/expirationTime.
    const interno = desescapar(entre(xmlSoap, 'loginCmsReturn') ?? xmlSoap);
    const token = entre(interno, 'token');
    const sign = entre(interno, 'sign');
    const expStr = entre(interno, 'expirationTime');
    if (!token || !sign) {
      const fault = extraerFaultXml(xmlSoap);
      throw new ServiceUnavailableException(
        `Respuesta de WSAA sin Token/Sign${fault ? `: ${fault}` : '.'}`,
      );
    }
    const expira = expStr
      ? new Date(expStr).getTime()
      : Date.now() + TA_TTL_SEGUNDOS * 1000;
    return { token, sign, expira };
  }
}

// ─── Helpers de parseo XML/SOAP ──────────────────────────────────────────────
function entre(xml: string, tag: string): string | null {
  const m = xml.match(
    new RegExp(`<(?:\\w+:)?${tag}[^>]*>([\\s\\S]*?)</(?:\\w+:)?${tag}>`, 'i'),
  );
  return m ? m[1] : null;
}

function desescapar(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function extraerFaultXml(xml: string): string | null {
  return entre(xml, 'faultstring');
}

function extraerFault(e: unknown): string | null {
  if (axios.isAxiosError(e) && typeof e.response?.data === 'string') {
    return extraerFaultXml(e.response.data);
  }
  return null;
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

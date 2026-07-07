import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Client } from 'minio';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

const DEFAULT_BUCKET = 'custos-archivos';
const URL_EXPIRY_SECONDS = 60 * 60; // 1 hora

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Client;
  private readonly bucket: string;
  private bucketVerificado = false;

  constructor() {
    this.bucket = process.env.MINIO_BUCKET || DEFAULT_BUCKET;
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'minio',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_USER || '',
      secretKey: process.env.MINIO_PASSWORD || '',
    });
  }

  async onModuleInit() {
    // El bucket se verifica también en cada subida (ver asegurarBucket): si acá
    // falla porque MinIO todavía no está listo, no tiramos el arranque de la API.
    await this.asegurarBucket().catch((e) => {
      this.logger.warn(
        `No se pudo verificar el bucket "${this.bucket}" al arrancar (se reintenta en la primera subida): ${msg(e)}`,
      );
    });
  }

  /**
   * Garantiza que el bucket exista antes de escribir. Se llama en cada subida (no
   * solo al arrancar) porque el volumen de MinIO puede recrearse en caliente: si
   * el bucket desaparece después del boot, las subidas fallaban con un 500 opaco.
   * Una vez verificado con éxito, se cachea para no pegarle a MinIO cada vez.
   */
  private async asegurarBucket() {
    if (this.bucketVerificado) return;
    const existe = await this.client.bucketExists(this.bucket).catch((e) => {
      throw new Error(`no se pudo consultar el bucket: ${msg(e)}`);
    });
    if (!existe) {
      await this.client.makeBucket(this.bucket).catch((e) => {
        // Otro proceso puede haberlo creado en la carrera: no es error.
        if (!/BucketAlreadyOwnedByYou|BucketAlreadyExists/i.test(msg(e))) {
          throw new Error(`no se pudo crear el bucket: ${msg(e)}`);
        }
      });
      this.logger.log(`Bucket "${this.bucket}" creado.`);
    }
    this.bucketVerificado = true;
  }

  async subir(
    buffer: Buffer,
    nombreOriginal: string,
    contentType: string,
    carpeta: string,
  ): Promise<{ key: string; url: string }> {
    const extension = nombreOriginal.split('.').pop() || 'bin';
    const key = `${carpeta}/${randomUUID()}.${extension}`;

    try {
      await this.asegurarBucket();
      await this.client.putObject(this.bucket, key, buffer, buffer.length, {
        'Content-Type': contentType,
      });
    } catch (e) {
      this.logger.error(
        `Fallo al subir "${key}" a MinIO (${process.env.MINIO_ENDPOINT || 'minio'}:${process.env.MINIO_PORT || 9000}): ${msg(e)}`,
      );
      throw new ServiceUnavailableException(
        'No se pudo guardar el archivo: el almacenamiento no está disponible.',
      );
    }

    // La URL firmada es best-effort: varios llamadores solo usan la key. Si
    // MinIO no puede firmar (p. ej. problema de región), la subida ya está hecha
    // y no debe fallar por esto.
    const url = await this.obtenerUrlFirmada(key).catch((e) => {
      this.logger.warn(`No se pudo firmar la URL de "${key}": ${msg(e)}`);
      return '';
    });
    return { key, url };
  }

  async obtenerUrlFirmada(key: string): Promise<string> {
    return this.client.presignedGetObject(this.bucket, key, URL_EXPIRY_SECONDS);
  }

  async eliminar(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }

  // Servimos el archivo a través de la API en vez de exponer la URL firmada
  // de MinIO directamente: esa URL apunta al hostname interno "minio", que
  // no es resoluble desde el navegador del usuario.
  async descargar(
    key: string,
  ): Promise<{ stream: Readable; contentType: string }> {
    try {
      const [stat, stream] = await Promise.all([
        this.client.statObject(this.bucket, key),
        this.client.getObject(this.bucket, key),
      ]);
      return {
        stream,
        contentType:
          (stat.metaData?.['content-type'] as string) ||
          'application/octet-stream',
      };
    } catch (e) {
      this.logger.error(`Fallo al descargar "${key}" de MinIO: ${msg(e)}`);
      throw new ServiceUnavailableException(
        'No se pudo leer el archivo del almacenamiento.',
      );
    }
  }
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

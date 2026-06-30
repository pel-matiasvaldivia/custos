import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { randomUUID } from 'crypto';

const DEFAULT_BUCKET = 'custos-archivos';
const URL_EXPIRY_SECONDS = 60 * 60; // 1 hora

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly client: Client;
  private readonly bucket: string;

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
    const existe = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!existe) {
      await this.client.makeBucket(this.bucket);
    }
  }

  async subir(
    buffer: Buffer,
    nombreOriginal: string,
    contentType: string,
    carpeta: string,
  ): Promise<{ key: string; url: string }> {
    const extension = nombreOriginal.split('.').pop() || 'bin';
    const key = `${carpeta}/${randomUUID()}.${extension}`;

    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': contentType,
    });

    const url = await this.obtenerUrlFirmada(key);
    return { key, url };
  }

  async obtenerUrlFirmada(key: string): Promise<string> {
    return this.client.presignedGetObject(this.bucket, key, URL_EXPIRY_SECONDS);
  }

  async eliminar(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}

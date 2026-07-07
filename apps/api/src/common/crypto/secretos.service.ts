import { Injectable, Logger } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

/**
 * Cifra/descifra secretos de dispositivos (contraseñas de cámaras) con AES-256-GCM.
 * La clave se deriva de `APP_SECRET_KEY` (env). El texto en claro NUNCA se guarda:
 * en `dispositivo.params` va solo el blob cifrado bajo `secreto`.
 *
 * Formato del blob: base64(iv[12] || authTag[16] || ciphertext).
 */
@Injectable()
export class SecretosService {
  private readonly logger = new Logger(SecretosService.name);
  private readonly key: Buffer;

  constructor() {
    const raw = process.env.APP_SECRET_KEY || process.env.JWT_SECRET || '';
    if (!raw) {
      this.logger.warn(
        'APP_SECRET_KEY no configurada: los secretos de dispositivos usan una clave derivada débil.',
      );
    }
    // Normaliza cualquier longitud de clave a 32 bytes para AES-256.
    this.key = createHash('sha256')
      .update(raw || 'custos-dev-key')
      .digest();
  }

  cifrar(plano: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ct = Buffer.concat([cipher.update(plano, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, ct]).toString('base64');
  }

  descifrar(blob: string): string {
    const buf = Buffer.from(blob, 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ct = buf.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString(
      'utf8',
    );
  }
}

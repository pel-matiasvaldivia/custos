import { IsOptional, IsString, Length } from 'class-validator';

/**
 * Configura las credenciales del dispositivo compartido de un objetivo
 * (modo "un celular por objetivo"). Ambos campos son opcionales: se puede setear
 * solo el PIN, solo el TAG NFC, o ambos. Enviar cadena vacía limpia el valor.
 */
export class ConfigurarDispositivoDto {
  @IsOptional()
  @IsString()
  @Length(4, 8)
  pin?: string;

  @IsOptional()
  @IsString()
  nfc_tag_id?: string;
}

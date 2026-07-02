import { IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * Login del dispositivo compartido de un objetivo. Dos vías:
 *  - nfc_tag: el TAG NFC/RFID pegado en el objetivo (identifica el objetivo, no
 *    hace falta PIN: la posesión física del tag es la credencial).
 *  - objetivo_id + pin: si el objetivo no tiene TAG configurado.
 */
export class LoginDispositivoDto {
  @IsOptional()
  @IsString()
  nfc_tag?: string;

  // Código del objetivo (lo que el guardia puede tipear); el PIN desambigua
  // entre tenants, igual que el login por legajo.
  @IsOptional()
  @IsString()
  objetivo_codigo?: string;

  @IsOptional()
  @IsUUID()
  objetivo_id?: string;

  @IsOptional()
  @IsString()
  pin?: string;
}

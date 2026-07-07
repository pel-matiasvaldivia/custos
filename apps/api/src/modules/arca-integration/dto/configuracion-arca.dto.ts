import { IsArray, IsIn, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Normaliza el campo `puntos_venta`: en el form multipart llega como texto
 * ("1,3") o como valor único; lo convertimos a una lista de enteros positivos
 * sin duplicados. Un punto de venta inválido se descarta silenciosamente.
 */
function normalizarPuntos(value: unknown): number[] {
  const bruto = Array.isArray(value) ? value : [value];
  const nums = bruto
    .flatMap((v) => String(v ?? '').split(','))
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isInteger(n) && n > 0);
  return [...new Set(nums)];
}

export class GuardarConfiguracionArcaDto {
  @IsOptional()
  @IsIn(['HOMOLOGACION', 'PRODUCCION'])
  ambiente?: string;

  @IsOptional()
  @Matches(/^\d{11}$/, {
    message: 'El CUIT del emisor debe tener 11 dígitos, sin guiones.',
  })
  cuit_emisor?: string;

  @IsOptional()
  @IsIn(['RESPONSABLE_INSCRIPTO', 'MONOTRIBUTO', 'EXENTO'])
  condicion_iva?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => normalizarPuntos(value))
  puntos_venta?: number[];
}

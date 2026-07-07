import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const CONDICIONES_IVA = [
  'RESPONSABLE_INSCRIPTO',
  'MONOTRIBUTO',
  'EXENTO',
  'CONSUMIDOR_FINAL',
];

/** Datos de empresa/facturación que el propio tenant edita en Configuración. */
export class ActualizarMiTenantDto {
  @IsOptional() @IsString() @MaxLength(200) razon_social?: string;
  @IsOptional() @IsString() @MaxLength(20) cuit?: string;
  @IsOptional() @IsIn(CONDICIONES_IVA) condicion_iva?: string;
  @IsOptional() @IsString() @MaxLength(300) direccion?: string;
  @IsOptional() @IsString() @MaxLength(150) email_contacto?: string;
  @IsOptional() @IsString() @MaxLength(50) telefono_contacto?: string;
}

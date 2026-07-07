import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateVigilanteDto {
  @IsString()
  @IsNotEmpty()
  legajo_nro: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  documento: string;

  // CUIL completo (11 dígitos): lo que ARCA necesita para altas y LSD. Opcional
  // en la carga rápida, pero requerido para exportar el legajo a ARCA.
  @IsOptional()
  @Matches(/^\d{11}$/, {
    message: 'El CUIL debe tener 11 dígitos, sin guiones.',
  })
  cuil?: string;

  @IsOptional()
  @IsDateString()
  fecha_ingreso?: string;

  @IsOptional()
  @IsIn(['ACTIVO', 'SUSPENDIDO', 'BAJA'])
  estado?: string;

  @IsOptional()
  @IsString()
  domicilio?: string;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  codigo_postal?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  contacto_emerg_nombre?: string;

  @IsOptional()
  @IsString()
  contacto_emerg_telefono?: string;

  @IsOptional()
  @IsString()
  contacto_emerg_vinculo?: string;
}

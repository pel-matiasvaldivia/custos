import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

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

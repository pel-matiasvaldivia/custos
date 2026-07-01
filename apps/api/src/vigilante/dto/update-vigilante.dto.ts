import { IsString, IsOptional, IsIn, IsNumber, Min } from 'class-validator';
import { VIGILADOR_ESTADOS_ACEPTADOS } from '../vigilador-estado';

export class UpdateVigilanteDto {
  @IsOptional()
  @IsString()
  legajo_nro?: string;

  // Liquidaciones: valor hora y categoría del Convenio 507.
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_hora?: number;

  @IsOptional()
  @IsString()
  categoria_laboral?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsIn(VIGILADOR_ESTADOS_ACEPTADOS)
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

import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateVigilanteDto {
  @IsOptional()
  @IsString()
  legajo_nro?: string;

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
  @IsIn(['ACTIVO', 'SUSPENDIDO', 'BAJA'])
  estado?: string;
}

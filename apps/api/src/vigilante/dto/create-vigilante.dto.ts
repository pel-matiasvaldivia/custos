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
}

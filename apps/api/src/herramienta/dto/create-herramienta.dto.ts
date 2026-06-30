import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

const TIPOS_HERRAMIENTA = ['RADIO', 'HANDIE', 'CHALECO', 'ARMA', 'LINTERNA', 'OTRO'];

export class CreateHerramientaDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsString()
  @IsIn(TIPOS_HERRAMIENTA)
  tipo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsString()
  numero_serie?: string;
}

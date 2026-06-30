import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateVehiculoDto {
  @IsString()
  @IsNotEmpty()
  patente: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsIn(['COMUN', 'BLINDADO', 'MOTO'])
  tipo?: string;
}

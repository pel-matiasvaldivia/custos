import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateObjetivoDto {
  @IsString()
  @IsNotEmpty()
  cliente_nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}

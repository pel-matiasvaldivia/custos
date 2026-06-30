import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateObjetivoDto {
  @IsOptional()
  @IsUUID()
  cliente_id?: string;

  // Si se manda cliente_id, cliente_nombre se completa como snapshot desde
  // Cliente.razon_social; si no, queda como texto libre (compatibilidad).
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cliente_nombre?: string;

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

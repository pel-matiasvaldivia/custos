import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CotizacionItemDto {
  @IsString()
  @IsNotEmpty()
  puesto_nombre: string;

  @IsOptional()
  @IsIn(['HORAS_HOMBRE', 'HORAS_VEHICULO', 'HORAS_SERVICIO_ESPECIAL'])
  tipo?: string;

  @IsNumber()
  @Min(1)
  horas_mensuales: number;

  @IsNumber()
  @Min(0)
  costo_hora: number;

  @IsNumber()
  @Min(0)
  margen: number;

  @IsNumber()
  @Min(0)
  subtotal: number;
}

export class CreateCotizacionDto {
  @IsOptional()
  @IsUUID()
  cliente_id?: string;

  // Si se manda cliente_id, cliente_nombre se completa como snapshot desde
  // Cliente.razon_social; si no, queda como texto libre (compatibilidad).
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cliente_nombre?: string;

  @IsDateString()
  vencimiento: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CotizacionItemDto)
  items: CotizacionItemDto[];
}

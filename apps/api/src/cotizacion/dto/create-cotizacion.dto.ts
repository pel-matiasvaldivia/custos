import {
  IsString,
  IsNotEmpty,
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
  @IsString()
  @IsNotEmpty()
  cliente_nombre: string;

  @IsDateString()
  vencimiento: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CotizacionItemDto)
  items: CotizacionItemDto[];
}

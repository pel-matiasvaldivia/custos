import {
  IsInt,
  Min,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class VentanaCoberturaDto {
  @IsInt()
  @Min(1)
  horas_dia: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  dias: number[]; // ISO: 1=Lunes .. 7=Domingo
}

export class UpsertPuestoCoberturaDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  dotacion_requerida?: number;

  @ValidateNested()
  @Type(() => VentanaCoberturaDto)
  ventana: VentanaCoberturaDto;
}

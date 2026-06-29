import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrdenItemDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio_unitario: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsUUID()
  contrato_id?: string;

  @IsOptional()
  @IsUUID()
  vehiculo_id?: string;
}

export class CreateOrdenDto {
  @IsOptional()
  @IsUUID()
  solicitud_id?: string;

  @IsString()
  @IsNotEmpty()
  proveedor_nombre: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdenItemDto)
  items: OrdenItemDto[];
}

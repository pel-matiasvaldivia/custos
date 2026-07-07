import {
  IsArray,
  IsInt,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemFacturaDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0.01)
  cantidad: number;

  // Precio unitario NETO (sin IVA). El service calcula IVA y total.
  @IsNumber()
  @Min(0)
  precio_unitario: number;
}

export class FacturarDto {
  @IsOptional()
  @IsUUID()
  cliente_id?: string;

  @IsString()
  @IsNotEmpty()
  cliente_nombre: string;

  // 1=Fact A, 6=Fact B, 11=Fact C, 3/8/13=Notas de Crédito.
  @IsInt()
  @IsIn([1, 3, 6, 8, 11, 13])
  tipo_comprobante: number;

  @IsInt()
  @Min(1)
  punto_venta: number;

  // 80=CUIT, 96=DNI, 99=Consumidor Final.
  @IsInt()
  @IsIn([80, 96, 99])
  doc_tipo: number;

  @IsString()
  @IsNotEmpty()
  doc_nro: string;

  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  concepto?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemFacturaDto)
  items: ItemFacturaDto[];
}

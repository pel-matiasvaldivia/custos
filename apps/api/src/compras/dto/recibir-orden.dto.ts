import {
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemRecepcionDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(0)
  cantidad: number;
}

export class RecibirOrdenDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemRecepcionDto)
  items: ItemRecepcionDto[];
}

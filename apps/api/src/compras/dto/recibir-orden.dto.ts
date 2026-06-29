import { IsArray, ValidateNested, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ItemRecepcionDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @Min(0)
  cantidad_recibida: number;
}

export class RecibirOrdenDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemRecepcionDto)
  items: ItemRecepcionDto[];
}

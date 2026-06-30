import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCatalogoItemDto {
  @IsString()
  @IsNotEmpty()
  etiqueta: string;
}

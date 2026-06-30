import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AsignarHerramientaDto {
  @IsString()
  @IsNotEmpty()
  vigilador_id: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

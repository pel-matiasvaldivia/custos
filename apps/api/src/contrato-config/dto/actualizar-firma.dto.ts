import { IsOptional, IsString } from 'class-validator';

export class ActualizarFirmaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  cargo?: string;
}

import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCredencialDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numero?: string;

  @IsOptional()
  @IsString()
  organismo?: string;

  @IsOptional()
  @IsDateString()
  emitida_el?: string;

  @IsOptional()
  @IsDateString()
  vence_el?: string;
}

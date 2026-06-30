import { IsString, IsNotEmpty, IsOptional, IsIn, IsDateString } from 'class-validator';

const TIPOS_CREDENCIAL = [
  'CARNET_VIGILADOR',
  'PSICOFISICO',
  'ANTECEDENTES',
  'ANMAC',
  'CAPACITACION',
];

export class CreateCredencialDto {
  @IsString()
  @IsIn(TIPOS_CREDENCIAL)
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

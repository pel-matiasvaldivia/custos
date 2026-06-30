import { IsString, IsOptional, IsIn, IsNumber, IsInt, IsBoolean, IsDateString } from 'class-validator';

export class UpdateContratoDto {
  @IsOptional()
  @IsString()
  cliente_nombre?: string;

  @IsOptional()
  @IsDateString()
  inicio?: string;

  @IsOptional()
  @IsDateString()
  fin?: string;

  @IsOptional()
  @IsIn(['ACTIVO', 'SUSPENDIDO', 'FINALIZADO'])
  estado?: string;

  @IsOptional()
  @IsIn(['POR_PLANIFICADO', 'POR_REAL', 'ABONO_FIJO'])
  modo?: string;

  @IsOptional()
  @IsNumber()
  tarifa_hora?: number;

  @IsOptional()
  @IsNumber()
  abono_mensual?: number;

  @IsOptional()
  @IsInt()
  redondeo_min?: number;

  @IsOptional()
  @IsBoolean()
  penaliza_hueco?: boolean;
}

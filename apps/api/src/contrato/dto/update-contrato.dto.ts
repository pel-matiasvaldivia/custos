import {
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class UpdateContratoDto {
  @IsOptional()
  @IsUUID()
  objetivo_id?: string;

  @IsOptional()
  @IsUUID()
  cliente_id?: string;

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
  @IsInt()
  horas_contratadas?: number;

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

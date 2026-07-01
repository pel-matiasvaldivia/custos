import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsIn,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateContratoDto {
  @IsOptional()
  @IsUUID()
  cliente_id?: string;

  // Si se manda cliente_id, cliente_nombre se completa como snapshot desde
  // Cliente.razon_social; si no, queda como texto libre (compatibilidad).
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cliente_nombre?: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsUUID()
  objetivo_id?: string;

  @IsOptional()
  @IsDateString()
  inicio?: string;

  @IsOptional()
  @IsDateString()
  fin?: string;

  @IsIn(['POR_PLANIFICADO', 'POR_REAL', 'ABONO_FIJO'])
  modo: string;

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

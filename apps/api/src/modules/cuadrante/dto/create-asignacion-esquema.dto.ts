import { IsUUID, IsInt, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateAsignacionEsquemaDto {
  @IsUUID()
  puesto_id: string;

  @IsUUID()
  vigilador_id: string;

  @IsUUID()
  esquema_id: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  posicion_ciclo?: number;

  @IsDateString()
  fecha_ancla: string;

  @IsDateString()
  vigente_desde: string;

  @IsOptional()
  @IsDateString()
  generar_desde?: string;

  @IsOptional()
  @IsDateString()
  generar_hasta?: string;
}

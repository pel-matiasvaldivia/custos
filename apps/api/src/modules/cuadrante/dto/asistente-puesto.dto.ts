import {
  IsUUID,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsDateString,
  IsIn,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Una "banda" es un tramo horario del puesto (mañana, tarde, noche, o un turno
 * de 12h). `vigilador_ids` son las personas que rotan cubriéndola: las primeras
 * `dotacion` son las que trabajan en simultáneo, y las que sobran actúan de
 * franqueros (cubren los francos de las demás). El motor de rotación garantiza
 * que siempre haya exactamente `dotacion` personas en la banda cada día.
 */
export class BandaPuestoDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora de inicio debe tener formato HH:MM.',
  })
  hora_inicio: string;

  @IsInt()
  @Min(1)
  duracion_horas: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  dotacion?: number;

  @IsOptional()
  @IsIn(['DIURNO', 'NOCTURNO', 'MIXTO'])
  tipo_bloque?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  vigilador_ids: string[];
}

export class AsistentePuestoDto {
  @IsUUID()
  objetivo_id: string;

  // Si no se manda puesto_id, se crea un puesto nuevo con puesto_nombre.
  @IsOptional()
  @IsUUID()
  puesto_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  puesto_nombre?: string;

  @IsDateString()
  vigente_desde: string;

  @IsOptional()
  @IsDateString()
  fecha_ancla?: string;

  @IsOptional()
  @IsDateString()
  generar_hasta?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BandaPuestoDto)
  bandas: BandaPuestoDto[];
}

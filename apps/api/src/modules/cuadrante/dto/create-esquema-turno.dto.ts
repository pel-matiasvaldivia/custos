import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BloqueDefDto {
  @IsString()
  @IsNotEmpty()
  hora_inicio: string; // 'HH:MM'

  @IsInt()
  @Min(1)
  duracion_horas: number;

  @IsOptional()
  @IsIn(['DIURNO', 'NOCTURNO', 'MIXTO'])
  tipo_bloque?: string;
}

export class DiaDefDto {
  @IsIn(['TRABAJO', 'FRANCO'])
  tipo: 'TRABAJO' | 'FRANCO';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BloqueDefDto)
  bloques?: BloqueDefDto[];
}

export class CreateEsquemaTurnoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @Min(1)
  dias_ciclo: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DiaDefDto)
  dias: DiaDefDto[];
}

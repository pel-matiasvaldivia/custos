import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateNovedadDto {
  @IsOptional()
  @IsUUID()
  puesto_id?: string;

  @IsOptional()
  @IsUUID()
  vigilador_id?: string;

  // Tipo tomado del catálogo NOVEDAD_TIPO (configurable por el tenant), por eso
  // se acepta cualquier código no vacío en vez de un enum fijo.
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsOptional()
  @IsIn(['BAJA', 'NORMAL', 'ALTA', 'CRITICA'])
  prioridad?: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adjuntos?: string[];
}

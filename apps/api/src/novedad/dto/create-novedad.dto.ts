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

  @IsIn(['GENERAL', 'ALARMA', 'RELEVAMIENTO', 'EMERGENCIA'])
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

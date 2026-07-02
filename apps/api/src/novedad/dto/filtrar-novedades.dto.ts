import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

/**
 * Filtros del listado/reporte de novedades. Extiende la paginación para que el
 * ValidationPipe global (forbidNonWhitelisted) no rechace estos query params.
 */
export class FiltrarNovedadesDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  objetivoId?: string;

  @IsOptional()
  @IsUUID()
  puestoId?: string;

  @IsOptional()
  @IsUUID()
  vigiladorId?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  prioridad?: string;

  @IsOptional()
  @IsString()
  desde?: string; // ISO date

  @IsOptional()
  @IsString()
  hasta?: string; // ISO date

  @IsOptional()
  @IsString()
  q?: string; // texto libre sobre la descripción
}

import { IsUUID, IsOptional, IsString } from 'class-validator';

export class SolicitarRelevoDto {
  @IsUUID()
  turno_original_id: string;

  @IsOptional()
  @IsString()
  motivo?: string;
}

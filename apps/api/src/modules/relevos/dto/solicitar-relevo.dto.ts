import { IsUUID, IsOptional, IsString } from 'class-validator';

export class SolicitarRelevoDto {
  @IsUUID()
  turno_original_id: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  // Modo dispositivo: el vigilador que solicita se identifica por acción.
  @IsOptional()
  @IsUUID()
  vigiladorId?: string;
}

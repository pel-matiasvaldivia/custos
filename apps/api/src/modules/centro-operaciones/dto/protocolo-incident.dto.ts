import { IsOptional, IsString } from 'class-validator';

export class VerificarIncidentDto {
  // LLAMADA_GUARDIA | CAMARA | LLAMADA_CLIENTE | AUDIO | OTRO
  @IsString()
  metodo: string;

  @IsOptional()
  @IsString()
  nota?: string;
}

export class DespacharIncidentDto {
  // POLICIA | BOMBEROS | MOVIL_PROPIO | SUPERVISOR | EMERGENCIAS_MEDICAS | OTRO
  @IsString()
  destino: string;

  @IsOptional()
  @IsString()
  nota?: string;
}

export class NotaIncidentDto {
  @IsString()
  nota: string;
}

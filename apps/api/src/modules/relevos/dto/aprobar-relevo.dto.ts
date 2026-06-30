import { IsUUID } from 'class-validator';

export class AprobarRelevoDto {
  @IsUUID()
  vigilador_relevista_id: string;
}

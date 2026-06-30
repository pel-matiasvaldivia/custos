import { IsUUID } from 'class-validator';

export class AsignarVigiladorDto {
  @IsUUID()
  vigilador_id: string;
}

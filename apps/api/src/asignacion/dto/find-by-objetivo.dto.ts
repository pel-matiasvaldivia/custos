import { IsDateString, IsUUID } from 'class-validator';

export class FindByObjetivoDto {
  @IsUUID()
  objetivoId: string;

  @IsDateString()
  desde: string;

  @IsDateString()
  hasta: string;
}

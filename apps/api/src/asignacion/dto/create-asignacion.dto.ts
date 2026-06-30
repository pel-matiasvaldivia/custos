import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAsignacionDto {
  @IsUUID()
  puesto_id: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora_inicio: string;

  @IsString()
  @IsNotEmpty()
  hora_fin: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class ResolveIncidentDto {
  @IsString()
  @IsNotEmpty()
  disposicion: string;

  @IsString()
  @IsNotEmpty()
  resumen: string;
}

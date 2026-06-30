import { IsString, MinLength } from 'class-validator';

export class UpdatePlantillaContratoDto {
  @IsString()
  @MinLength(1)
  plantilla_html: string;
}

import { IsString, MinLength } from 'class-validator';

export class GenerarDocumentoDto {
  @IsString()
  @MinLength(1)
  html: string;
}

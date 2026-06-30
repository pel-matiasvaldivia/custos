import { IsString, IsNotEmpty } from 'class-validator';

export class LoginVigiladorDto {
  @IsString()
  @IsNotEmpty()
  legajo_nro: string;

  @IsString()
  @IsNotEmpty()
  pin: string;
}

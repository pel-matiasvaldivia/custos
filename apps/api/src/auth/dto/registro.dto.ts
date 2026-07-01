import { IsEmail, IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegistroDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  empresa_nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  razon_social?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}-\d{7,8}-\d$/, { message: 'CUIT inválido. Formato: XX-XXXXXXXX-X' })
  cuit?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;
}

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  razon_social: string;

  @IsOptional()
  @IsString()
  nombre_fantasia?: string;

  @IsOptional()
  @IsString()
  cuit?: string;

  @IsOptional()
  @IsString()
  domicilio?: string;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  contacto_nombre?: string;

  @IsOptional()
  @IsEmail()
  contacto_email?: string;

  @IsOptional()
  @IsString()
  contacto_telefono?: string;
}

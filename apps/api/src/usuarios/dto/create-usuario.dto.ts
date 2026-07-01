import { IsEmail, IsIn, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export const ROLES_TENANT = ['ADMIN', 'GERENCIA', 'SUPERVISOR', 'COMERCIAL', 'OPERADOR'] as const;
export type RolTenant = (typeof ROLES_TENANT)[number];

export class CreateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nombre?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn(ROLES_TENANT)
  role: RolTenant;
}

import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ROLES_TENANT, RolTenant } from './create-usuario.dto';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nombre?: string;

  @IsOptional()
  @IsIn(ROLES_TENANT)
  role?: RolTenant;
}

export class ResetPasswordDto {
  @IsString()
  @MaxLength(128)
  password: string;
}

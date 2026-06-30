import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpdatePuestoDto {
  @IsOptional()
  @IsUUID()
  objetivo_id?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsBoolean()
  requiere_arma?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_movil?: boolean;

  @IsOptional()
  esquema_horario?: Prisma.InputJsonValue;
}

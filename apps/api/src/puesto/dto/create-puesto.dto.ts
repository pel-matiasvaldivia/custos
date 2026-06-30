import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID, IsNumber } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreatePuestoDto {
  @IsOptional()
  @IsUUID()
  objetivo_id?: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsBoolean()
  requiere_arma?: boolean;

  @IsOptional()
  @IsBoolean()
  requiere_movil?: boolean;

  @IsOptional()
  esquema_horario?: Prisma.InputJsonValue;
}

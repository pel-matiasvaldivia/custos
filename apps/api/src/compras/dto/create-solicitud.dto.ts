import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  monto_estimado: number;

  @IsOptional()
  @IsUUID()
  contrato_id?: string;

  @IsOptional()
  @IsUUID()
  vehiculo_id?: string;
}

import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCostosDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  costo_hora_base?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cargas_sociales?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costos_uniforme?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otros_costos?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  factor_ajuste?: number;
}

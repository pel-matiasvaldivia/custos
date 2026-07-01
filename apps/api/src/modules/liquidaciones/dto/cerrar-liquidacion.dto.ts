import { IsDateString, IsIn, IsOptional, IsNumber, Min } from 'class-validator';

export class CerrarLiquidacionDto {
  @IsDateString()
  desde: string;

  @IsDateString()
  hasta: string;

  @IsOptional()
  @IsIn(['VALOR_HORA_MANUAL', 'BASICO_507', 'SOLO_HORAS'])
  modo?: string;

  // Valor hora por defecto cuando el vigilador no tiene uno cargado.
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_hora_default?: number;
}

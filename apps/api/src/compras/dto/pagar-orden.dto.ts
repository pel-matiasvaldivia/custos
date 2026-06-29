import { IsNumber, Min } from 'class-validator';

export class PagarOrdenDto {
  @IsNumber()
  @Min(0)
  monto: number;
}

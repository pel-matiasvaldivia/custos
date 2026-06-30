import { IsIn } from 'class-validator';

export class CambiarEstadoCotizacionDto {
  @IsIn(['ENVIADA', 'ACEPTADA', 'RECHAZADA'])
  estado: string;
}

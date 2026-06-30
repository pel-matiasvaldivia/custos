import { IsUUID } from 'class-validator';

export class AsignarVehiculoDto {
  @IsUUID()
  vehiculo_id: string;
}

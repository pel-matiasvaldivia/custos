import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindObjetivosDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  clienteId?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindClientesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  busqueda?: string;
}

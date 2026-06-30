import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindPuestosDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  objetivoId?: string;
}

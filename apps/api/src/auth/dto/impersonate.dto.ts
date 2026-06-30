import { IsUUID } from 'class-validator';

export class ImpersonateDto {
  @IsUUID()
  tenant_id: string;
}

import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TenantContextService {
  private static readonly storage = new AsyncLocalStorage<string>();

  run(tenantId: string, callback: () => any) {
    return TenantContextService.storage.run(tenantId, callback);
  }

  getTenantId(): string | undefined {
    return TenantContextService.storage.getStore();
  }
}

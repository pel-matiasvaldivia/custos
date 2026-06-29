import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from '../context/tenant-context.service';
import { getJwtSecret } from '../config/jwt.config';
import * as jwt from 'jsonwebtoken';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantContext: TenantContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        // VERIFY (no decode): valida la firma para que el tenant no sea forjable.
        const decoded: any = jwt.verify(token, getJwtSecret());
        // El claim del payload es `tenant_id` (ver AuthService.login).
        const tenantId = decoded?.tenant_id;
        if (tenantId && UUID_RE.test(tenantId)) {
          return this.tenantContext.run(tenantId, () => next());
        }
      } catch {
        // Token inválido/expirado → sigue sin contexto de tenant (fail-closed).
      }
    }
    next();
  }
}

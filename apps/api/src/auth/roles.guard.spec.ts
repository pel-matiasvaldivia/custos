import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let reflector: Reflector;

  const ctxConRol = (role: string): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ user: { role } }) }),
      getHandler: () => null,
      getClass: () => null,
    }) as any;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('permite cuando no hay roles requeridos', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(ctxConRol('OPERADOR'))).toBe(true);
  });

  it('permite cuando el rol del usuario está incluido', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN', 'GERENCIA']);
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(ctxConRol('GERENCIA'))).toBe(true);
  });

  it('bloquea (Forbidden) cuando el rol no está incluido', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN', 'GERENCIA']);
    const guard = new RolesGuard(reflector);
    expect(() => guard.canActivate(ctxConRol('OPERADOR'))).toThrow(
      ForbiddenException,
    );
  });
});

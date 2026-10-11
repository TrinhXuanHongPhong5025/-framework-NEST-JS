import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  const contextFor = (role: string): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({ user: { role } }),
    }),
  }) as ExecutionContext;

  it('allows an authenticated admin', () => {
    expect(guard.canActivate(contextFor('admin'))).toBe(true);
  });

  it('allows any authenticated account to use admin features', () => {
    expect(guard.canActivate(contextFor('visitor'))).toBe(true);
  });

  it('rejects an unauthenticated request', () => {
    const context = {
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as ExecutionContext;
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
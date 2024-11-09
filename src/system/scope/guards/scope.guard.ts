import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopeIds = this.reflector.get<string[]>('scopes', context.getHandler());

    if (!requiredScopeIds) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.scopes) {
      throw new ForbiddenException('No tiene permiso para acceder a este recurso.');
    }

    // Verifica si el usuario tiene al menos uno de los scopes requeridos
    const hasScope = requiredScopeIds.some(scopeId => user.scopes.includes(scopeId));
    if (!hasScope) {
      throw new ForbiddenException('No tiene permiso para acceder a este recurso.');
    }

    return true;
  }
}

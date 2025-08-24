import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { ActiveUserData } from '../authentication/active-user-data.interface';
import { REQUEST_USER_KEY } from '../authentication/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
        REQUEST_USER_KEY
    ];
    return requiredRoles.some((role) => user.role === role);
  }
}

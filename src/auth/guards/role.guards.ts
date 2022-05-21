import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler()],
    );

    if (!requiredRole) {
      return true;
    }

    const { headers } = context.switchToHttp().getRequest();

    const token = headers.authorization.split(' ')[1];

    const decoded_user = this.jwtService.decode(token) as any;

    return requiredRole[0] == decoded_user.role;
  }
}

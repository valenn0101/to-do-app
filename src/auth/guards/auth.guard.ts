import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/service/users.service';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../../constants/key-decorator';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../../interface/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers['user_token'];
    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token is expired');
    }
    const { sub } = manageToken;

    const user = await this.userService.findUserById(sub);
    if (!user) {
      throw new UnauthorizedException('User is invalid');
    }

    request.idUser = user.id;
    request.username = user.username;
    return true;
  }
}

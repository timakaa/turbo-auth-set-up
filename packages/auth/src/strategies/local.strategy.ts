import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';
import { auth } from '@repo/proto/auth/interfaces';

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private authService: auth.AuthService;

  constructor(
    @Inject(AUTH_SERVICE_NAME)
    private authClient: ClientGrpc,
  ) {
    super({
      usernameField: 'email',
    });
  }

  onModuleInit() {
    this.authService =
      this.authClient.getService<auth.AuthService>('AuthService');
  }

  async validate(email: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('Please provide your password!');
    return await firstValueFrom(
      this.authService.validateLocalUser({
        email,
        password,
      }),
    );
  }
}

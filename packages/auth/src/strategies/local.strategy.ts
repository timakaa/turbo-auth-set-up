import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthPatterns } from '@repo/contracts/auth';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('Please provide your password!');
    return await firstValueFrom(
      this.authClient.send(AuthPatterns.VALIDATE_LOCAL_USER, {
        email,
        password,
      }),
    );
  }
}

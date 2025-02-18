import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { jwtConfig } from '../config';
import type { AuthJwtPayload } from '../types';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';
import { auth } from '@repo/proto/auth/interfaces';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private authService: auth.AuthService;

  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private authClient: ClientGrpc,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    } as StrategyOptionsWithoutRequest);
  }

  onModuleInit() {
    this.authService =
      this.authClient.getService<auth.AuthService>('AuthService');
  }

  async validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return await firstValueFrom(
      this.authService.validateJwtUser({
        userId,
      }),
    );
  }
}

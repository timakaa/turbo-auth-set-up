import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { refreshJwtConfig as refreshConfig } from '../config';
import { Request } from 'express';
import type { ConfigType } from '@nestjs/config';
import type { AuthJwtPayload } from '../types';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';
import { auth } from '@repo/proto/auth/interfaces';

@Injectable()
export class RefreshStrategy
  extends PassportStrategy(Strategy, 'refresh-jwt')
  implements OnModuleInit
{
  private authService: auth.AuthService;

  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private authClient: ClientGrpc,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenConfig.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  onModuleInit() {
    this.authService =
      this.authClient.getService<auth.AuthService>('AuthService');
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.body.refresh;

    return await firstValueFrom(
      this.authService.validateRefreshToken({
        userId,
        refreshToken,
      }),
    );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { refreshJwtConfig as refreshConfig } from '../config';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import type { AuthJwtPayload } from '../types';
import { ClientProxy } from '@nestjs/microservices';
import { AuthPatterns } from '@repo/contracts/auth';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private authClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenConfig.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.body.refresh;

    return await firstValueFrom(
      this.authClient.send(AuthPatterns.VALIDATE_REFRESH_TOKEN, {
        userId,
        refreshToken,
      }),
    );
  }
}

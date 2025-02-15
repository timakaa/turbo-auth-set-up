import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { jwtConfig } from '../config';
import type { AuthJwtPayload } from '../types';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthPatterns } from '@repo/contracts/auth';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private authClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return await firstValueFrom(
      this.authClient.send(AuthPatterns.VALIDATE_JWT_USER, {
        userId,
      }),
    );
  }
}

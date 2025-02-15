import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { googleOAuthConfig } from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthPatterns } from '@repo/contracts/auth';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOAuthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOAuthConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private readonly authClient: ClientProxy,
  ) {
    super({
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = await firstValueFrom(
      this.authClient.send(AuthPatterns.LOGIN, {
        email: profile.emails[0].value,
        name: profile.displayName,
        // TODO: Figure out how to handle password for google login
        password: '',
      }),
    );

    done(null, user);
    return user;
  }
}

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { googleOAuthConfig } from '../config/google-oauth.config';
import type { ConfigType } from '@nestjs/config';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';
import { auth } from '@repo/proto/auth/interfaces';

@Injectable()
export class GoogleStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private isConnected = false;
  private authService: auth.AuthService;

  constructor(
    @Inject(googleOAuthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOAuthConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private readonly authClient: ClientGrpc,
  ) {
    console.log('Google Strategy Constructor');
    console.log('Config:', {
      clientID: googleConfig.clientID,
      clientSecret: '***',
      callbackURL: googleConfig.callbackURL,
    });

    super({
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  onModuleInit() {
    this.authService =
      this.authClient.getService<auth.AuthService>('AuthService');
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const payload = {
        email: profile.emails[0].value,
        name: profile.displayName,
        password: '',
      };

      console.log('Sending auth request with payload:', payload);

      const user = await firstValueFrom(
        this.authService.validateGoogleUser(payload),
      ).catch((err) => {
        console.error('Error during auth service communication:', err);
        throw err;
      });

      console.log('Received user from auth service:', user);
      return done(null, user);
    } catch (error) {
      console.error('Validation error:', error);
      this.isConnected = false;
      return done(error, false);
    }
  }
}

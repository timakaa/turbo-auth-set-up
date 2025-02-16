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
import { AuthPatterns } from '@repo/contracts/auth';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private isConnected = false;

  constructor(
    @Inject(googleOAuthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOAuthConfig>,
    @Inject(AUTH_SERVICE_NAME)
    private readonly authClient: ClientProxy,
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

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      if (!this.isConnected) {
        await this.authClient.connect();
        this.isConnected = true;
      }

      const payload = {
        email: profile.emails[0].value,
        name: profile.displayName,
        password: '',
      };

      console.log('Sending auth request with payload:', payload);

      const user = await firstValueFrom(
        this.authClient.send(AuthPatterns.VALIDATE_GOOGLE_USER, payload),
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

  onModuleInit() {
    // Connect when the module initializes
    this.authClient.connect();
  }

  onModuleDestroy() {
    // Cleanup connection
    this.authClient.close();
  }
}

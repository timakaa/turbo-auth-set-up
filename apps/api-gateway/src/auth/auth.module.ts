import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_HOST, AUTH_SERVICE_PORT } from '@repo/config/auth';
import { AUTH_SERVICE_NAME } from './constant';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@repo/auth/guards';
import { JwtModule } from '@nestjs/jwt';
import {
  googleOAuthConfig,
  jwtConfig,
  refreshJwtConfig as refreshConfig,
} from '@repo/auth/config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '@repo/auth/strategies';
import { GoogleStrategy } from '@repo/auth/strategies';
import { RefreshStrategy } from '@repo/auth/strategies';
import { LocalStrategy } from '@repo/auth/strategies';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: AUTH_SERVICE_HOST,
            port: AUTH_SERVICE_PORT,
          },
        }),
      },
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOAuthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuard(JwtAuthGuard)
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}

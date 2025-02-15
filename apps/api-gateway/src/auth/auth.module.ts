import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_HOST, AUTH_SERVICE_PORT } from '@repo/config/auth';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@repo/auth/guards';
import { JwtStrategy } from '@repo/auth/strategies';
import { GoogleStrategy } from '@repo/auth/strategies';
import { RefreshStrategy } from '@repo/auth/strategies';
import { LocalStrategy } from '@repo/auth/strategies';
import { AUTH_SERVICE_NAME } from '@repo/contracts/auth';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  googleOAuthConfig,
  jwtConfig,
  refreshJwtConfig,
} from '@repo/auth/config';

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
    ConfigModule.forFeature(googleOAuthConfig),
    ConfigModule.forFeature(refreshJwtConfig),
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

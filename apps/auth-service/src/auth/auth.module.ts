import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import {
  jwtConfig,
  refreshJwtConfig as refreshConfig,
} from '@repo/auth/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from '@repo/contracts/users';
import { USER_SERVICE_HOST, USER_SERVICE_PORT } from '@repo/config/users';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE_NAME,
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: USER_SERVICE_HOST,
            port: USER_SERVICE_PORT,
          },
        }),
      },
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}

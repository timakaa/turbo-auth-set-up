import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_HOST, AUTH_SERVICE_PORT } from '@repo/config/auth';
import { AUTH_SERVICE_NAME } from './constant';

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
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

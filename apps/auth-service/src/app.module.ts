import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  USER_SERVICE_HOST,
  USER_SERVICE_NAME,
  USER_SERVICE_PORT,
} from '@repo/config/users';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
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
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}

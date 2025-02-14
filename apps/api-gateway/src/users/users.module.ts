import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from './constant';
import { USER_SERVICE_HOST, USER_SERVICE_PORT } from '@repo/config';

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
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

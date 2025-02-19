import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  USER_SERVICE_HOST,
  USER_SERVICE_NAME,
  USER_SERVICE_PORT,
} from '@repo/config/users';
import { UsersProtoPaths } from '@repo/config/proto-paths';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE_NAME,
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            protoPath: UsersProtoPaths.PROTO_PATH,
            url: `${USER_SERVICE_HOST}:${USER_SERVICE_PORT}`,
            package: 'users',
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  constructor() {
    console.log('User Service Host: ', USER_SERVICE_HOST);
    console.log('User Service Port: ', USER_SERVICE_PORT);
  }
}

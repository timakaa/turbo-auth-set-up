import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  USER_SERVICE_HOST,
  USER_SERVICE_NAME,
  USER_SERVICE_PORT,
} from '@repo/config/users';
import { TokenModule } from '@repo/auth';
import { UsersProtoPaths } from '@repo/config/proto-paths';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE_NAME,
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            url: `${USER_SERVICE_HOST}:${USER_SERVICE_PORT}`,
            package: 'users',
            protoPath: UsersProtoPaths.PROTO_PATH,
          },
        }),
      },
    ]),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

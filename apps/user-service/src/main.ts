import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { USER_SERVICE_HOST, USER_SERVICE_PORT } from '@repo/config/users';
import { UsersProtoPaths } from '@repo/config/proto-paths';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${USER_SERVICE_HOST}:${USER_SERVICE_PORT}`,
        package: 'users',
        protoPath: UsersProtoPaths.PROTO_PATH,
      },
    },
  );

  await app.listen();
}
bootstrap();

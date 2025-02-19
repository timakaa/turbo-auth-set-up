import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_SERVICE_HOST, AUTH_SERVICE_PORT } from '@repo/config/auth';
import { AuthProtoPaths } from '@repo/config/proto-paths';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: AuthProtoPaths.PROTO_PATH,
        url: `${AUTH_SERVICE_HOST}:${AUTH_SERVICE_PORT}`,
      },
    },
  );

  await app.listen();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_SERVICE_HOST, AUTH_SERVICE_PORT } from '@repo/config/auth';
import { AUTH_PROTO_PATH } from '@repo/config/proto-paths';

async function bootstrap() {
  // Create actual microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: AUTH_PROTO_PATH,
        url: `${AUTH_SERVICE_HOST}:${AUTH_SERVICE_PORT}`,
      },
    },
  );

  await app.listen();
}
bootstrap();

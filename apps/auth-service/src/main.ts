import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_SERVICE_HOST, AUTH_SERVICE_PORT } from '@repo/config/auth';

async function bootstrap() {
  // Create actual microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: AUTH_SERVICE_HOST,
        port: AUTH_SERVICE_PORT,
      },
    },
  );

  await app.listen();
}
bootstrap();

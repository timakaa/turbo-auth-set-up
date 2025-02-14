import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { USER_SERVICE_HOST, USER_SERVICE_PORT } from '@repo/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: USER_SERVICE_HOST,
        port: USER_SERVICE_PORT,
      },
    },
  );

  await app.listen();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();  // Enable shutdown hooks to listen for the shutdown event
  await app.listen(3000);
}
bootstrap();

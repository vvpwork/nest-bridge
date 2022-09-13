import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';

const { port } = config;

process.on('unhandledRejection', (reason, promise) => {
  Logger.log(reason);
});

process.on('uncaughtException', (error, source) => {
  Logger.log(error, source);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port || 8001);
}
bootstrap();

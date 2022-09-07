import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';

const { port } = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port || 8001);
}
bootstrap();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app.module.js';

/**
 * https://docs.nestjs.com/recipes/swagger
 */
async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('OpenAPI Documentation')
    .setDescription('The sample API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(8000);

  return app.getUrl();
}

bootstrap()
  .then((url: string) => Logger.log(url, 'Bootstrap'))
  .catch((err: Error) => Logger.error(err, 'Bootstrap'));

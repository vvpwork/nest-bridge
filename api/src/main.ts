import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import basicAuth from 'express-basic-auth';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { apiV1Alias } from './common/constants';
import { config } from './common/config';

process.on('unhandledRejection', (reason: any, promise: any) => {
  Logger.log(reason, promise);
});

process.on('uncaughtException', (error: Error, source: any) => {
  Logger.log(error, source);
});

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(apiV1Alias);

  // Auth for api-doc endpoint
  app.use(
    '/api/v1/api-doc',
    basicAuth({
      challenge: true,
      users: {
        [process.env.API_USER_NAME || 'bridge']: process.env.API_USER_PASSWORD || 'bridge2022',
      },
    }),
  );

  // *******  swagger setup
  const options = new DocumentBuilder()
    .setTitle('OpenAPI Documentation')
    .setDescription('Bridge Tower Api Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1/api-doc', app, document);
  // *******

  // *******  global middlewares
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  // *******

  await app.listen(config.port || 8000);
  return app.getUrl();
}

bootstrap()
  .then((url: string) => Logger.log(url, 'Bootstrap'))
  .catch((err: Error) => Logger.error(err, 'Bootstrap'));

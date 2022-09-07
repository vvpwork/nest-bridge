import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, RouterModule, APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SequelizeModule } from '@nestjs/sequelize';

import { config } from '@Common/config';
import { ExceptionsFilter } from '@Common/filters';
import {
  AuthModule,
  ExampleModule,
  ProfileModule,
  LibraryModule,
  PodcastModule,
  NewsModule,
  HealthCheckModule,
  RabbitModule,
} from './modules';
import * as models from './db/models';
import { SseModule } from './modules/sse/sse.module';
import { BlockchainModule } from './modules/blockchain';

const imports = [
  // DB postgres
  SequelizeModule.forRoot({ ...config.db, models: Object.values(models) }),

  // Redis
  RedisModule.forRoot({ config: config.redis }),

  RabbitModule,
  BlockchainModule,
  // api
  AuthModule,
  ExampleModule,
  ProfileModule,
  LibraryModule,
  SseModule,
  PodcastModule,
  NewsModule,
  HealthCheckModule,
  RouterModule.register([
    {
      path: '/example',
      module: ExampleModule,
    },
    {
      path: '/auth',
      module: AuthModule,
    },
    {
      path: '/profiles',
      module: ProfileModule,
    },
    {
      path: '/libraries',
      module: LibraryModule,
    },
    {
      path: '/podcasts',
      module: PodcastModule,
    },
    {
      path: '/news',
      module: NewsModule,
    },
    {
      path: '/sse',
      module: SseModule,
    },
  ]),
];

const providers = [
  { provide: APP_GUARD, useClass: AuthModule },

  // Global Filter, Exception check
  { provide: APP_FILTER, useClass: ExceptionsFilter },

  // Global Pipe, Validation check
  // https://docs.nestjs.com/pipes#global-scoped-pipes
  // https://docs.nestjs.com/techniques/validation
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      // disableErrorMessages: true,
      transform: true, // transform object to DTO class
      whitelist: true,
    }),
  },
];

@Module({
  imports,
  controllers: [],
  providers,
})
export class AppModule {}

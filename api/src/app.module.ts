import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, RouterModule, APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { config } from '@Common/config';
import { ExceptionsFilter } from '@Common/filters';
import { DatabaseModule } from '@DB/database.module';
import { AuthModule, ExampleModule, RabbitExampleModule, ProfileModule, LibraryModule } from './modules';

const imports = [
  // DB postgres
  DatabaseModule,

  // Redis
  RedisModule.forRoot({ config: config.redis }),

  // Rabbit
  RabbitExampleModule,

  // api
  AuthModule,
  ExampleModule,
  ProfileModule,
  LibraryModule,
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

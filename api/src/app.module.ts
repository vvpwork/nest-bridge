import { Module, ValidationPipe, Logger } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { config } from '@Common/config';
import { ExceptionsFilter } from '@Common/filters';

import { AuthModule, ExampleModule, RabbitExampleModule, ProfileModule } from './modules';

const imports = [
  // DB postgres
  SequelizeModule.forRoot({ ...config.db, models: [], logging: Logger.log }),

  // Redis
  RedisModule.forRoot({ config: config.redis }),

  // Rabbit
  RabbitExampleModule,

  AuthModule,
  ExampleModule,
  RouterModule.register([
    {
      path: '/example',
      module: ExampleModule,
    },
    {
      path: '/login',
      module: AuthModule,
    },
    {
      path: '/profiles',
      module: ProfileModule,
    },
  ]),
];

const providers = [
  // Global Guard, Authentication check on all routers
  // { provide: APP_GUARD, useClass: AuthenticatedGuard },

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

import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, RouterModule, APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';

import { config } from '@Common/config';
import { ExceptionsFilter } from '@Common/filters';

import * as models from '@DB/models';
import {
  AuthModule,
  ProfileModule,
  LibraryModule,
  PodcastModule,
  NewsModule,
  HealthCheckModule,
  RabbitModule,
  CollectionModule,
  NftModule,
  OrderModule,
  TransactionHistoryModule,
  ConfigApiModule,
  NotificationModule,
  DashboardModule,
} from './modules';
import { SseModule } from './modules/sse/sse.module';
import { BlockchainModule } from './modules/blockchain';
import { CreatorsModule } from './modules/creators';
import { SecuritizeModule } from './modules/securitize';

const routes = RouterModule.register([
  {
    path: '/collection',
    module: CollectionModule,
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
  {
    path: '/nft',
    module: NftModule,
  },
  {
    path: '/orders',
    module: OrderModule,
  },
  {
    path: '/config',
    module: ConfigApiModule,
  },
  {
    path: '/notifications',
    module: NotificationModule,
  },
  {
    path: '/creators',
    module: CreatorsModule,
  },
  {
    path: '/transactions',
    module: TransactionHistoryModule,
  },
  {
    path: '/dashboard',
    module: DashboardModule,
  },
  {
    path: '/securitize',
    module: SecuritizeModule,
  },
]);

const imports = [
  // DB mariaDB
  SequelizeModule.forRoot({
    ...config.db,
    synchronize: true,
    models: Object.values(models),
    logging: console.log,
  }),

  MulterModule.register({
    dest: './files',
  }),
  // Redis
  RedisModule.forRoot({ config: config.redis }),

  // Global
  RabbitModule,
  BlockchainModule,

  // api
  AuthModule,
  ProfileModule,
  LibraryModule,
  SseModule,
  PodcastModule,
  NewsModule,
  HealthCheckModule,
  CollectionModule,
  NftModule,
  OrderModule,
  TransactionHistoryModule,
  ConfigApiModule,
  NotificationModule,
  CreatorsModule,
  DashboardModule,
  routes,
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

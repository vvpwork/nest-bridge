import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, RouterModule, APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';

import { config } from '@Common/config';
import { ExceptionsFilter } from '@Common/filters';
import { ConfigModule } from '@nestjs/config';
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
} from './modules';
import * as models from './db/models';
import { SseModule } from './modules/sse/sse.module';
import { BlockchainModule } from './modules/blockchain';
import { TransactionHistoryService } from './modules/transaction-history/transaction-history.service';
// import { BlockchainModule } from './modules/blockchain';

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
]);

const imports = [
  // DB mariaDB
  SequelizeModule.forRoot({ ...config.db, synchronize: true, models: Object.values(models), logging: Logger.log }),

  MulterModule.register({
    dest: './files',
  }),
  // Redis
  RedisModule.forRoot({ config: config.redis }),

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

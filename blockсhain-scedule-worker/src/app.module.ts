import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './common/config';
import * as models from './db/models';
import { RabbitModule, BlockchainModule, CronJobModule } from './modules';

@Module({
  imports: [
    BlockchainModule,
    SequelizeModule.forRoot({
      ...config.db,
      models: Object.values(models),
      logging: Logger.log,
    }),
    ScheduleModule.forRoot(),
    RabbitModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

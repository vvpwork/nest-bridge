import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './common/config';
import { IdentityNftBalanceLock } from './db/models';
import { RabbitModule, BlockchainModule, CronJobModule } from './modules';

@Module({
  imports: [
    BlockchainModule,
    SequelizeModule.forRoot({
      ...config.db,
      models: [IdentityNftBalanceLock],
      logging: Logger.log,
    }),
    SequelizeModule.forFeature([IdentityNftBalanceLock]),
    ScheduleModule.forRoot(),
    RabbitModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

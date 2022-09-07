import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from './common/config';
import { IdentityNftBalanceLock } from './db/models';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...config.db,
      models: [IdentityNftBalanceLock],
      logging: Logger.log,
    }),
    SequelizeModule.forFeature([IdentityNftBalanceLock]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

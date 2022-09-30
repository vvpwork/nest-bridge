import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityNftBalanceLock, NotificationModel } from '@DB/models';
import { CronJobService } from './cron-job.service';
import { RabbitModule } from '../rabbit';

@Module({
  providers: [CronJobService],
  imports: [
    SequelizeModule.forFeature([IdentityNftBalanceLock, NotificationModel]),
    RabbitModule,
  ],
})
export class CronJobModule {}

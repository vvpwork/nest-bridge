import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityNftBalanceLock, NotificationModel } from '@/db/models';
import { CronJobService } from './cron-job.service';

@Module({
  providers: [CronJobService],
  imports: [
    SequelizeModule.forFeature([IdentityNftBalanceLock, NotificationModel]),
  ],
})
export class CronJobModule {}

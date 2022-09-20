import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityNftBalanceLock } from '@/db/models';
import { CronJobService } from './cron-job.service';

@Module({
  providers: [CronJobService],
  imports: [SequelizeModule.forFeature([IdentityNftBalanceLock])],
})
export class CronJobModule {}

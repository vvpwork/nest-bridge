import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';
import { NotificationModel, PodcastModel } from '@/db/models';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, PodcastModel])],
  controllers: [PodcastController],
  providers: [PodcastService, NotificationService],
})
export class PodcastModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { NotificationModel, PodcastModel } from '@DB/models';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, PodcastModel])],
  controllers: [PodcastController],
  providers: [PodcastService, NotificationService],
})
export class PodcastModule {}

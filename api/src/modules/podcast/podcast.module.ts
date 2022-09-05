import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';
import { NotificationEntity, PodcastEntity } from '@/db/models';

@Module({
  imports: [SequelizeModule.forFeature([NotificationEntity, PodcastEntity])],
  controllers: [PodcastController],
  providers: [PodcastService, NotificationService],
})
export class PodcastModule {}

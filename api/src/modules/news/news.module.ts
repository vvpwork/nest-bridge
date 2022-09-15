import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsModel, NewsLikeModel, NotificationModel } from '@/db/models';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, NewsModel, NewsLikeModel])],
  controllers: [NewsController],
  providers: [NewsService, NotificationService],
  exports: [NewsService],
})
export class NewsModule {}

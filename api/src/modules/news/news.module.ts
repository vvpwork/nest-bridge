import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { NewsModel, NewsLikeModel, NotificationModel } from '@DB/models';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, NewsModel, NewsLikeModel])],
  controllers: [NewsController],
  providers: [NewsService, NotificationService],
  exports: [NewsService],
})
export class NewsModule {}

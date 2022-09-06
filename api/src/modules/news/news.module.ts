import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News, NewsLike, Notification } from '@/db/models';
// import { AuthService } from '';

@Module({
  imports: [SequelizeModule.forFeature([Notification, News, NewsLike])],
  controllers: [NewsController],
  providers: [NewsService, NotificationService],
})
export class NewsModule {}

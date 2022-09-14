import { forwardRef, Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsModel, NewsLikeModel, NotificationModel } from '@/db/models';
import { AuthModule, ProfileModule, ProfileService } from '@/modules';
// import { AuthService } from '';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, NewsModel, NewsLikeModel])],
  controllers: [NewsController],
  providers: [NewsService, NotificationService],
  exports: [NewsService],
})
export class NewsModule {}

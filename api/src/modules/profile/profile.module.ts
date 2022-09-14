import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationModule, NotificationService } from '@Modules/notification';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {
  FollowerModel,
  IdentityModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NotificationModel,
  PodcastModel,
  ProfileModel,
} from '@/db/models';
import { NewsModule } from '../news/news.module';
import { AuthModule, AuthService, NewsService } from '@/modules';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      ProfileModel,
      IdentityModel,
      LibraryModel,
      PodcastModel,
      NewsModel,
      FollowerModel,
      NotificationModel,
      NewsLikeModel,
    ]),
    AuthModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

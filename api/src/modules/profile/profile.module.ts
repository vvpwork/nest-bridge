import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationModule, NotificationService } from '@Modules/notification';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {
  FollowerModel,
  IdentityModel,
  LibraryModel,
  NewsModel,
  NotificationModel,
  PodcastModel,
  ProfileModel,
} from '@/db/models';

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
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

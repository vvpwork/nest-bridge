import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {
  BlockchainIdentityAddressModel,
  FollowerModel,
  IdentityModel,
  LibraryModel,
  NewsLikeModel,
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
      NewsLikeModel,
      BlockchainIdentityAddressModel,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

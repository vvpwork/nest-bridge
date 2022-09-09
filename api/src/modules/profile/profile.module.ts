import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { IdentityModel, LibraryModel, PodcastModel, ProfileModel } from '@/db/models';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([ProfileModel, IdentityModel, LibraryModel, PodcastModel])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

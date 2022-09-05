import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Identity, Profile } from '@/db/models';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Profile, Identity])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

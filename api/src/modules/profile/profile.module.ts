import { Global, Module } from '@nestjs/common';

import { profileProviders } from '@Modules/profile/profile.providers';
import { ProfileController } from './controllers';
import { ProfileService } from './services';

@Global()
@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService, ...profileProviders],
  exports: [ProfileService],
})
export class ProfileModule {}

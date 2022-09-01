import { Module } from '@nestjs/common';

import { ProfileController } from './controllers';
import { ProfileService } from './services';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}

import { Module } from '@nestjs/common';

import { NotificationService } from '@Modules/notification/services';
import { libraryProviders } from '@Modules/library/library.providers';
import { LibraryController } from './controllers';
import { LibraryService } from './services';

@Module({
  imports: [],
  controllers: [LibraryController],
  providers: [LibraryService, NotificationService, ...libraryProviders],
})
export class LibraryModule {}

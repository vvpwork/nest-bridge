import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Library, Notification } from '@/db/models';

@Module({
  imports: [SequelizeModule.forFeature([Notification, Library])],
  controllers: [LibraryController],
  providers: [LibraryService, NotificationService],
})
export class LibraryModule {}

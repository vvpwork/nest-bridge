import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { LibraryModel, NotificationModel } from '@/db/models';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, LibraryModel])],
  controllers: [LibraryController],
  providers: [LibraryService, NotificationService],
})
export class LibraryModule {}

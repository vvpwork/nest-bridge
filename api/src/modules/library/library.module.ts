import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from '@Modules/notification';
import { LibraryModel, NotificationModel } from '@DB/models';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel, LibraryModel])],
  controllers: [LibraryController],
  providers: [LibraryService, NotificationService],
})
export class LibraryModule {}

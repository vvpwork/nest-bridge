import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CollectionModel } from '@/db/models';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [SequelizeModule.forFeature([CollectionModel])],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}

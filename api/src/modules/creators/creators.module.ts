import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityNftCreatorModel } from '@/db/models';
import { CreatorsService } from './creators.service';
import { CreatorsController } from './creators.controller';

@Module({
  controllers: [CreatorsController],
  imports: [SequelizeModule.forFeature([IdentityNftCreatorModel])],
  providers: [CreatorsService],
})
export class CreatorsModule {}

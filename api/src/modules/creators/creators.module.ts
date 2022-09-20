import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityNftCreatorModel } from '@/db/models';
import { CreatorsService } from './creators.service';
import { CreatorsController } from './creators.controller';
import { BlockchainModule } from '../blockchain';

@Module({
  controllers: [CreatorsController],
  imports: [SequelizeModule.forFeature([IdentityNftCreatorModel]), BlockchainModule],
  providers: [CreatorsService],
})
export class CreatorsModule {}

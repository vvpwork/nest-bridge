import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlockchainIdentityAddressModel, IdentityModel, ProfileModel } from '@/db/models';
import { IdentityService } from './identity.service';

@Module({
  imports: [
    SequelizeModule.forFeature([IdentityModel, BlockchainIdentityAddressModel, ProfileModel]),
  ],
  controllers: [],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}

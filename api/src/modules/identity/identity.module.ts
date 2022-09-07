import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Identity } from '@/db/models';
import { IdentityService } from './identity.service';

@Module({
  imports: [SequelizeModule.forFeature([Identity])],
  controllers: [],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}

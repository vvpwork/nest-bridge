import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from '@Modules/dashboard/dashboard.controller';
import { DashboardService } from '@Modules/dashboard/dashboard.service';
import { TransactionHistoryModel } from '@DB/models';

@Global()
@Module({
  controllers: [DashboardController],
  imports: [SequelizeModule.forFeature([TransactionHistoryModel])],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

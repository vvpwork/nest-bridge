import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderController } from './order.controller';
import { CurrenciesModel, IdentityNftBalanceLock, IdentityNftBalanceModel, OrdersModel } from '@/db/models';
import { OrderService } from './order.service';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel, IdentityNftBalanceModel, IdentityNftBalanceLock, CurrenciesModel]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

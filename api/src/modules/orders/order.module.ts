import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderController } from './order.controller';
import { CurrenciesModel, IdentityNftBalanceLock, IdentityNftBalanceModel, OrdersModel } from '@/db/models';
import { OrderService } from './order.service';
import { BlockchainModule } from '../blockchain';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel, IdentityNftBalanceModel, IdentityNftBalanceLock, CurrenciesModel]),
    BlockchainModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

import { Sequelize } from 'sequelize-typescript';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CurrenciesModel, IdentityNftBalanceLock, IdentityNftBalanceModel, OrdersModel } from '@/db/models';
import { ICreateOrderDto } from './dtos/order-create.dto';
import { IIdentityBalanceModel } from '@/db/interfaces';
import { IBuyOrderRequest } from './dtos/buy-order.dto';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { config } from '@/common/config';

const { lockPeriod } = config.nft;
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrdersModel) private orderModel: typeof OrdersModel,
    @InjectModel(IdentityNftBalanceModel) private balanceModel: typeof IdentityNftBalanceModel,
    @InjectModel(IdentityNftBalanceLock) private lockModel: typeof IdentityNftBalanceLock,
    @InjectModel(CurrenciesModel) private currencyModel: typeof CurrenciesModel,

    private historyService: TransactionHistoryService,
  ) {}

  async create(data: ICreateOrderDto) {
    Logger.log(data, '[Order Service] data to create data');
    const { identityId, nftId, amount, signature, metadata, price, currency } = data;

    const { availableBalance, balanceId } = await this.getAvailableBalance({ identityId, nftId });

    if (data.amount > availableBalance) throw new HttpException('Do not have enough balance ', 404);

    const currencyFromDb = await this.currencyModel.findOne({ where: { symbol: currency.toUpperCase() } });
    if (!currencyFromDb) throw new HttpException('Currency is not available', 404);

    const order = (
      await this.orderModel.create({
        nftIdentityBalanceId: balanceId,
        amount,
        signature,
        metadata,
        price,
        currency,
      })
    ).toJSON();

    await this.historyService.create({ identityId, type: 'list', amount: amount.toString(), price, nftId });

    // remove private info
    delete order.nftIdentityBalanceId;
    return {
      data: order,
    };
  }

  async delete(id: string) {
    const order = await this.orderModel.findOne({
      where: {
        id,
      },
    });
    if (!order) throw new HttpException('Not found', 404);
    await order.destroy();

    return {
      data: order.toJSON(),
    };
  }

  async update(data: Partial<OrdersModel & { identityId: string }>) {
    const oldOrder = await this.orderModel.findOne({
      where: {
        id: data.id,
      },
    });

    const { availableBalance, identityId } = await this.getAvailableBalance({
      id: oldOrder.toJSON().nftIdentityBalanceId,
    });

    if (identityId !== data.identityId) throw new HttpException('Permission error', 403);

    if (data.amount > oldOrder.amount && data.amount > availableBalance)
      throw new HttpException('Do not have enough balance', 404);

    oldOrder.amount = data.amount;
    if (data.price) oldOrder.price = data.price;
    await oldOrder.save();

    return {
      data: oldOrder,
    };
  }

  async buy(data: IBuyOrderRequest, identityId: string) {
    Logger.log(data, '[Order Service] data to buy data');
    const { buyAmount, orderId, txHash } = data;
    const order = await this.orderModel.findOne({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new HttpException('Order was not found', 404);
    if (data.buyAmount > order.amount) throw new HttpException('Invalid balance', 400);

    const sellerBalance = await this.balanceModel.findOne({
      where: { id: order.toJSON().nftIdentityBalanceId },
    });

    order.amount -= buyAmount;
    await order.save();

    sellerBalance.amount -= buyAmount;
    await sellerBalance.save();

    const [buyerBalance] = await this.balanceModel.findOrCreate({
      where: {
        identityId,
        nftId: sellerBalance.toJSON().nftId,
      },
      defaults: {
        id: getShortHash(identityId, sellerBalance.toJSON().nftId),
        identityId,
        nftId: sellerBalance.toJSON().nftId,
        amount: 0,
      },
    });

    buyerBalance.amount += buyAmount;
    await buyerBalance.save();

    await this.lockModel.create({
      identityNftBalanceId: buyerBalance.toJSON().id,
      unlockTime: Date.now() + lockPeriod * 1000,
      amount: buyAmount,
    });

    // ****** save history
    await this.historyService.create({
      identityId: sellerBalance.toJSON().identityId,
      txHash,
      type: 'sell',
      amount: buyAmount.toString(),
      price: order.price,
      nftId: sellerBalance.toJSON().nftId,
    });
    await this.historyService.create({
      identityId,
      txHash,
      type: 'buy',
      amount: buyAmount.toString(),
      price: order.price,
      nftId: sellerBalance.toJSON().nftId,
    });

    return {
      data: 'Ok',
    };
  }

  async findOne(id: string) {
    const order = await this.orderModel.findOne({
      where: { id },
      include: [
        {
          model: this.balanceModel,
          attributes: ['identityId', 'nftId'],
        },
      ],
    });
    if (!order) throw new HttpException('Not found', 404);

    return {
      data: order.toJSON(),
    };
  }

  private async getAvailableBalance(where: Partial<IIdentityBalanceModel>) {
    let availableBalance = 0;
    const balance = await this.balanceModel.findOne({
      where,
      include: [
        {
          model: OrdersModel,
          attributes: [[Sequelize.fn('sum', Sequelize.col('orders.amount')), 'total']],
        },
      ],
    });

    if (!balance.id) throw new HttpException('User does not have balance', 404);
    if (!balance.id) Logger.error('Error order');
    const onSaleBalance = balance.orders.length ? balance.orders[0].toJSON().total : 0;

    availableBalance = balance.amount - onSaleBalance;

    const [lockedBalance] = await this.lockModel.findAll({
      attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
      where: { identityNftBalanceId: balance.id },
    });
    if (lockedBalance) {
      availableBalance -= lockedBalance.amount;
    }
    return { availableBalance, balanceId: balance.id, identityId: balance.toJSON().identityId, nftId: balance.nftId };
  }
}

import { Sequelize } from 'sequelize-typescript';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bn } from '@/common/utils/';
import {
  CurrenciesModel,
  IdentityModel,
  IdentityNftBalanceLock,
  IdentityNftBalanceModel,
  NftModel,
  OrdersModel,
} from '@/db/models';
import { ICreateOrderDto } from './dtos/order-create.dto';
import { IIdentityBalanceModel, IOrderModel } from '@/db/interfaces';
import { IBuyOrderRequest } from './dtos/buy-order.dto';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { config } from '@/common/config';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IUserInterface } from '@/common/interfaces';
import { NotificationService } from '../notification';
import { NOTIFICATION_TYPES } from '@/db/enums';

const { lockPeriod } = config.nft;
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrdersModel) private orderModel: typeof OrdersModel,
    @InjectModel(IdentityNftBalanceModel) private balanceModel: typeof IdentityNftBalanceModel,
    @InjectModel(IdentityNftBalanceLock) private lockModel: typeof IdentityNftBalanceLock,
    @InjectModel(CurrenciesModel) private currencyModel: typeof CurrenciesModel,
    @InjectModel(IdentityModel) private identityModel: typeof IdentityModel,

    private bcService: BlockchainService,
    private historyService: TransactionHistoryService,
    private notificationService: NotificationService,
  ) {}

  // TODO refactor nftId
  async create(data: ICreateOrderDto, user?: IUserInterface['data']) {
    Logger.log(data, '[Order Service] data to create data');
    const { identityId, nftId, amount, signature, metadata, price, currency } = data;

    const { availableBalance, balanceId } = await this.getAvailableBalance({ identityId, nftId }, user);

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

    await this.historyService.create({
      identityId,
      type: 'list',
      amount,
      price,
      nftId,
      data: { metadata, signature },
    });

    await this.notificationService.addNotification(user.profileId, NOTIFICATION_TYPES.FOLLOWING_PERSON_LISTS_NFT, {
      name: user.userName,
      id: user.id,
      amount,
      price,
      nftId,
    });

    // remove private info
    delete order.nftIdentityBalanceId;
    return {
      data: order,
    };
  }

  async delete(id: string, data: { user: IUserInterface['data']; txHash: string }) {
    const order = await this.orderModel.findOne({
      where: {
        id,
      },
    });
    if (!order) throw new HttpException('Not found', 404);
    await order.destroy();

    await this.historyService.create({
      identityId: data.user.id,
      txHash: data.txHash,
      type: 'unList',
      amount: order.amount,
      price: order.price,
    });

    return {
      data: order.toJSON(),
    };
  }

  async update(data: Partial<IOrderModel>, user: IUserInterface['data']) {
    const oldOrder = await this.orderModel.findOne({
      where: {
        id: data.id,
      },
    });

    const { availableBalance, identityId } = await this.getAvailableBalance(
      {
        id: oldOrder.toJSON().nftIdentityBalanceId,
      },
      user,
    );

    if (identityId !== user.id) throw new HttpException('Permission error', 403);

    if (data.amount > oldOrder.amount && data.amount > availableBalance)
      throw new HttpException('Do not have enough balance', 404);

    oldOrder.amount = data.amount;
    oldOrder.signature = data.signature;
    oldOrder.metadata = data.metadata;
    if (data.price) oldOrder.price = data.price;
    await oldOrder.save();

    await this.historyService.create({
      identityId: user.id,
      amount: oldOrder.amount,
      price: oldOrder.price,
      type: 'priceUpdate',
      txHash: data.signature,
      data: data.metadata,
    });

    return {
      data: oldOrder,
    };
  }

  async buy(data: IBuyOrderRequest, user: IUserInterface['data']) {
    Logger.log(data, '[Order Service] data to buy data');
    const { buyAmount, orderId, txHash } = data;
    const order = await this.orderModel.findOne({
      where: {
        id: orderId,
      },
      include: [{ model: IdentityNftBalanceModel, include: [{ model: NftModel }, { model: IdentityModel }] }],
    });
    if (!order) throw new HttpException('Order was not found', 404);
    if (data.buyAmount > order.amount) throw new HttpException('Invalid balance', 400);

    const sellerBalance = await this.balanceModel.findOne({
      where: { id: order.toJSON().nftIdentityBalanceId },
    });

    order.amount -= buyAmount;
    await order.save();

    sellerBalance.amount -= buyAmount;
    if (sellerBalance.amount === 0) {
      sellerBalance.status = 'sold';
    }
    await sellerBalance.save();

    const [buyerBalance] = await this.balanceModel.findOrCreate({
      where: {
        identityId: user.id,
        nftId: sellerBalance.toJSON().nftId,
      },
      defaults: {
        id: getShortHash(user.id, sellerBalance.toJSON().nftId),
        identityId: user.id,
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
      amount: buyAmount,
      price: order.price,
      nftId: sellerBalance.toJSON().nftId,
    });

    await this.historyService.create({
      identityId: user.id,
      txHash,
      type: 'buy',
      amount: buyAmount,
      price: order.price,
      nftId: sellerBalance.toJSON().nftId,
    });

    const { nft } = order.nftIdentityBalance;
    await this.notificationService.addNotification(
      order.nftIdentityBalance.identity.profileId,
      NOTIFICATION_TYPES.NFT_SOLD,
      {
        id: nft.id,
        thumbnail: nft.thumbnail,
        name: nft.metadata.name,
        image: nft.metadata.image,
        price: data.buyAmount > 1 ? Bn.multiplyBy(order.price, data.buyAmount).toString() : order.price,
      },
    );

    const royaltyProfileIds = await this.identityModel
      .findAll({ where: { id: nft.royaltyIds }, attributes: ['profileId'] })
      .then((identities: Pick<IdentityModel, 'profileId'>[]) =>
        identities.map((identity: { profileId: number }) => identity.profileId),
      );

    await Promise.all(
      royaltyProfileIds.map((profileId: number) =>
        this.notificationService.addNotification(profileId, NOTIFICATION_TYPES.ROYALTY_RECEIVED, {
          id: nft.id,
          name: nft.metadata.name,
          thumbnail: nft.thumbnail,
          image: nft.metadata.image,
          royalty: Bn.multiplyBy(Bn.multiplyBy(order.price, data.buyAmount), nft.royalty).toString(),
        }),
      ),
    );

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

  private async getAvailableBalance(where: Partial<IIdentityBalanceModel>, user?: IUserInterface['data']) {
    let availableBalance = 0;
    const balance = await this.balanceModel.findOne({
      where,
      include: [
        {
          model: OrdersModel,
          attributes: [[Sequelize.fn('sum', Sequelize.col('orders.amount')), 'total']],
        },
        {
          model: NftModel,
          attributes: ['collectionId'],
          as: 'nft',
        },
      ],
    });

    if (!balance.id) throw new HttpException('Invalid balance', 404);

    const balanceFromBC = await this.bcService.getAvailableBalance(
      balance.nft.toJSON().collectionId,
      user.address,
      balance.toJSON().nftId,
    );
    Logger.log(
      'Is balance consistence with blockchain',
      +balanceFromBC === balance.toJSON().amount,
      balanceFromBC,
      balance.toJSON().amount,
    );
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

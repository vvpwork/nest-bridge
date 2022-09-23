import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';

import { NOTIFICATION_TYPES } from '@/db/enums';
import { config } from '../../common/config';
import { IdentityNftBalanceLock, NotificationModel } from '../../db/models';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class CronJobService {
  constructor(
    @InjectModel(IdentityNftBalanceLock)
    private lockRepository: typeof IdentityNftBalanceLock,
    @InjectModel(NotificationModel)
    private notificationRepository: typeof NotificationModel,
    private bcService: BlockchainService,
  ) {}

  @Cron(config.triggerTime)
  async triggerCronJob() {
    try {
      const [[result]]: any = await this.lockRepository.sequelize.query(
        `DELETE FROM IdentityNftBalanceLock WHERE unlockTime  <= ${Date.now()} RETURNING identityNftBalanceId, amount`,
      );
      Logger.log('[Cron service] Result after delete', JSON.stringify(result));

      if (result) {
        const getNft = `select  n.id  as nftId, pr.id as profileId, pr.userName, n.thumbnail from IdentityNftBalance b
        JOIN Nft n On n.id = b.nftId
        JOIN Identity ident On ident.id = b.identityId
        JOIN Profile pr On pr.id = ident.profileId
        where b.id = '${result.identityNftBalanceId}'
        `;

        const [[dataFromDb]]: any = await this.lockRepository.sequelize.query(
          getNft,
        );

        await this.notificationRepository.create({
          profileId: dataFromDb.profileId,
          params: {
            name: dataFromDb.name,
            thumbnail: dataFromDb.thumbnail,
            id: dataFromDb.nftId,
            amount: result.amount,
          },
          type: NOTIFICATION_TYPES.NFTS_UNLOCKED,
        });
        Logger.log(dataFromDb, '[Cron service] Save to Notification');
      }
    } catch (err) {
      Logger.error(err, '[Cron service]');
    }
  }


  async consistencyDataCheck() {
    const query = `
    SELECT id FROM Collection 
    Limit 100 
    `;

    const [collections]: any =
      await this.notificationRepository.sequelize.query(query);

    Logger.log(collections, '[Cron service] collections to source');
    if (collections) {
      let collectionToSearched: { id: string }[];
      if (collections.id) {
        collectionToSearched = [collections];
      } else {
        collectionToSearched = collections;
      }
      const addresses = collectionToSearched.map((v: { id: string }) => v.id);
      Logger.log('[Cron service] start to get past event', addresses);

      await this.bcService.rabbit.addCollection({
        addresses,
      });
      Logger.log('[Cron service] finish to get past event');
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';

import { NOTIFICATION_TYPES } from '@DB/enums';
import { IdentityNftBalanceLock, NotificationModel } from '@DB/models';
import { config } from '../../common/config';
import { BlockchainService } from '../blockchain/blockchain.service';
import { RabbitRootService } from '../rabbit/rabbit-root.service';

@Injectable()
export class CronJobService {
  constructor(
    @InjectModel(IdentityNftBalanceLock)
    private lockRepository: typeof IdentityNftBalanceLock,
    @InjectModel(NotificationModel)
    private notificationRepository: typeof NotificationModel,
    private bcService: BlockchainService,
    private rabbitService: RabbitRootService,
  ) {}

  @Cron(config.triggerTime)
  async triggerCronJob() {
    try {
      const [[result]]: any = await this.lockRepository.sequelize.query(
        `DELETE FROM IdentityNftBalanceLock WHERE unlockTime  <= ${Date.now()} RETURNING identityNftBalanceId, amount`,
      );

      if (result) {
        // TODO fixed it for array result
        Logger.log(
          '[Cron service] Result after delete',
          JSON.stringify(result),
        );
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
        //  TODO fixed publish to api
        //   this.rabbitService.publish({
        //     type: 'NFTS_UNLOCK',
        //     data: { nftId: dataFromDb.nftId },
        //   });
      }
    } catch (err) {
      Logger.error(err, '[Cron service]');
    }
  }

  // TODO move timeline to env 
  @Cron('0 */2 * * *')
  async consistencyDataCheck() {
    const query = `
    SELECT * FROM Collection 
  
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
      this.bcService.rabbit.addCollectionHandler({ addresses });
      Logger.log('[Cron service] finish to get past event');
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { config } from './common/config';
import { IdentityNftBalanceLock } from './db/models';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(IdentityNftBalanceLock)
    private lockRepository: typeof IdentityNftBalanceLock,
  ) {}

  @Cron(config.triggerTime)
  async triggerCronJob() {
    try {
      const result = await this.lockRepository.sequelize.query(
        `DELETE FROM IdentityNftBalanceLock WHERE unlockTime >= ${Date.now()}`,
      );
      Logger.log('Result after delete', JSON.stringify(result));
    } catch (err) {
      Logger.error(err);
    }
  }
}

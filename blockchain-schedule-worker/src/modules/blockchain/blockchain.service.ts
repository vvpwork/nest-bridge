/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@nestjs/common';

import { BlockchainUtilsService } from './services/blockchain-utils.service';
import { BlockchainRabbitService } from './services';

@Injectable()
export class BlockchainService {
  constructor(
    public rabbit: BlockchainRabbitService,
    public utils: BlockchainUtilsService,
  ) {}
}

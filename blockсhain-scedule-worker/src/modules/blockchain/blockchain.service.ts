/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, Logger } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { InjectModel } from '@nestjs/sequelize';

import { config } from '@/common/config';
import { IBlockchainUtils } from './interfaces/blockchain-utils.interface';
import { BlockchainUtilsService } from './services/blockchain-utils.service';
import { BlockchainRabbitService } from './services';
import { CloudinaryService } from '@/common/services/cloudinary.service';
import { NftModel } from '@/db/models';

const { secretKey, nodeUrl } = config.blockchain;
@Injectable()
export class BlockchainService {
  constructor(
    public rabbit: BlockchainRabbitService,
    public utils: BlockchainUtilsService,
  ) {}
}

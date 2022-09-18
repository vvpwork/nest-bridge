/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, Logger } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

import { config } from '@/common/config';
import { IBlockchainUtils } from './interfaces /blockchain-utils.interface';
import { BlockchainUtilsService } from './services/blockchain-utils.service';
import { BlockchainRabbitService } from './services';
import { CloudinaryService } from '@/common/services/cloudinary.service';

const { secretKey, nodeUrl } = config.blockchain;
@Injectable()
export class BlockchainService {
  private web3Instance: Web3;
  public readonly utils: IBlockchainUtils;
  public readonly rabbit: BlockchainRabbitService;

  constructor() {
    this.connect();
    this.utils = new BlockchainUtilsService(this.web3Instance);
    this.rabbit = new BlockchainRabbitService(
      this.web3Instance,
      new CloudinaryService(),
    );
  }

  connect() {
    // TODO change secret key to default
    this.web3Instance = new Web3(
      secretKey
        ? new HDWalletProvider(secretKey, nodeUrl)
        : new Web3.providers.HttpProvider(nodeUrl),
    );
    Logger.log(this.web3Instance, `Connect to blockchain nodeUrl ${nodeUrl}`);
  }
}

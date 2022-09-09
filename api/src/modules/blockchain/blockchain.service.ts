/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, Logger } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { config } from '@/common/config';
import { securitizeRegistryAbi } from './abis/securitizeRegistry';

const { secretKey, nodeUrl } = config.blockChain;
@Injectable()
export class BlockchainService {
  private securitizeRegistryContract: Contract;
  private web3Instance: Web3;
  constructor() {
    this.web3Instance = new Web3(new HDWalletProvider(secretKey, nodeUrl));
    this.securitizeRegistryContract = new this.web3Instance.eth.Contract(
      securitizeRegistryAbi,
      config.securitize.proxyAddress,
    );
    this.web3Instance.eth.net.isListening().catch(Logger.error);
  }

  async isWalletWhitelistedOnSecuritize(address: string): Promise<boolean> {
    return this.securitizeRegistryContract.methods.isWhitelistedWallet(address).call();
  }
}

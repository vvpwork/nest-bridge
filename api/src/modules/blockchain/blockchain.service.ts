/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { config } from '@/common/config';
import { securitizeRegistryAbi } from './abis/securitizeRegistry';

const { secretKey, nodeUrl } = config.blockChain;
@Injectable()
export class BlockchainService {
  private securitizeRegistryContract: Contract;
  constructor(private web3Instance: Web3 = new Web3(new HDWalletProvider(secretKey, nodeUrl))) {
    this.securitizeRegistryContract = new this.web3Instance.eth.Contract(securitizeRegistryAbi, config.securitize.proxyAddress);
  }

  async isWalletWhitelistedOnSecuritize(address: string): Promise<boolean> {
    return this.securitizeRegistryContract.methods.isWhitelistedWallet(address).call();
  }
}

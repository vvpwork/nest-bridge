import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { config } from '../config';

const { secretKey, nodeUrl } = config.blockchain;

export class Web3Instance {
  private static instance: Web3;

  private constructor() {}
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Web3(
        secretKey
          ? new HDWalletProvider(secretKey, nodeUrl)
          : new Web3.providers.HttpProvider(nodeUrl),
      );
    }
    return this.instance;
  }
}

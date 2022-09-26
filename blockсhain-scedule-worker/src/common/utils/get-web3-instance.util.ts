/* eslint-disable security/detect-object-injection */
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { config } from '../config';

const { secretKey, nodeUrl, nodeUrlWss } = config.blockchain;

export class Web3Instance {
  private static instanceHttp: Web3;
  private static instanceWss: Web3;

  private constructor() {}
  public static getInstance(type: 'wss' | 'http' = 'http') {
    const instance = type === 'wss' ? 'instanceWss' : 'instanceHttp';
    if (!this[instance]) {
      this[instance] = new Web3(
        type === 'wss'
          ? new Web3.providers.WebsocketProvider(nodeUrlWss)
          : new Web3.providers.HttpProvider(nodeUrl),
      );
    }
    return this[instance];
  }
}

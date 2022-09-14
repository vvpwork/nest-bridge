/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, Logger } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { config } from '@/common/config';
import { erc1155abi } from './abis/erc1155bridgeTowerProxy';

const { secretKey, nodeUrl } = config.blockchain;

@Injectable()
export class BlockchainService {
  private web3Instance: Web3;
  private collectionSequence: Map<string, Contract>;
  constructor() {
    this.init();
  }

  init() {
    try {
      this.web3Instance = new Web3(
        new HDWalletProvider(secretKey, config.blockchain.nodeUrl),
      );
    } catch (err) {
      Logger.error(err);
    }
  }

  async getAllPastEvents(contactAddress: string) {
    const contract = new this.web3Instance.eth.Contract(
      erc1155abi,
      contactAddress,
    );

    contract.events();

    const allEvents = await contract.getPastEvents('TransferSingle', {
      fromBlock: 12251787,
    });
  }

  async addCollection() {}

  parseNftFromEvent(data: any[]) {}
}

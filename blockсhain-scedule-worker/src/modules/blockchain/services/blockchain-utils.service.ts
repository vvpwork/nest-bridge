/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */

import Web3 from 'web3';

import { config } from '@/common/config';
import { erc1155abi } from '../abis/erc1155bridgeTowerProxy';
import { IBlockchainUtils } from '../interfaces/blockchain-utils.interface';
import { securitizeRegistryAbi } from '../abis/securitizeRegistry';

const { erc1155proxyC2 } = config.blockchain;

export class BlockchainUtilsService implements IBlockchainUtils {
  constructor(private web3Instance: Web3) {}

  async isWalletWhitelistedOnSecuritize(address: string): Promise<boolean> {
    const securitizeContract = new this.web3Instance.eth.Contract(
      securitizeRegistryAbi,
      config.securitize.proxyAddress,
    );

    return securitizeContract.methods.isWhitelistedWallet(address).call();
  }

  async isAddressPartner(address: string) {
    const contract = new this.web3Instance.eth.Contract(
      erc1155abi,
      erc1155proxyC2,
    );
    return contract.methods.isPartner(address).call();
  }

  isEthAddress(address: string) {
    return Web3.utils.isAddress(address);
  }
}

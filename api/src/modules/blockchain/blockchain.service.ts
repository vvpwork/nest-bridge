/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, Logger } from '@nestjs/common';
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { config } from '@/common/config';
import { securitizeRegistryAbi } from './abis/securitizeRegistry';
import { erc1155abi } from './abis/erc1155bridgeTowerProxy';
import { getAxiosInstance } from '@/common/utils';
import { CloudinaryService } from '@/common/services/cloudinary.service';

const { secretKey, nodeUrl } = config.blockChain;
@Injectable()
export class BlockchainService {
  private securitizeRegistryContract: Contract;
  private web3Instance: Web3;
  private cloudService: CloudinaryService;
  constructor() {
    this.cloudService = new CloudinaryService();
  }

  connect() {
    this.web3Instance = new Web3(new HDWalletProvider(secretKey, nodeUrl));
    this.securitizeRegistryContract = new this.web3Instance.eth.Contract(
      securitizeRegistryAbi,
      config.securitize.proxyAddress,
    );
  }

  async isWalletWhitelistedOnSecuritize(address: string): Promise<boolean> {
    return this.securitizeRegistryContract.methods.isWhitelistedWallet(address).call();
  }

  async isAddressPartner(address: string) {
    return this.securitizeRegistryContract.methods.isPartner(address).call();
  }

  async getPastCollectionNfts(collectionAddress: string) {
    const contract = new this.web3Instance.eth.Contract(erc1155abi, collectionAddress);
    const pastEvents = await contract.getPastEvents('TransferSingle');

    const mintedEvents = pastEvents
      .filter(event => event.returnValues.from === '0x0000000000000000000000000000000000000000')
      .map(ev => ({
        id: ev.returnValues.id,
        amount: ev.returnValues.value,
        owner: ev.returnValues.to,
      }));
  }

  async getDataForNFT(nftAddress: string, id: number) {
    const collectionContract = new this.web3Instance.eth.Contract(erc1155abi, nftAddress);

    const [creators, royalties, metadata] = await Promise.allSettled([
      // [[account], [valuse]]
      collectionContract.methods.getCreators(id).call(),
      // [[account ], [ value]]
      collectionContract.methods.getBridgeTowerRoyalties(id).call(),
      // {image}
      async () => {
        const uri = await collectionContract.methods.uri(id).call();
        const data: any = await getAxiosInstance(uri).get('');
        const imageData = await this.cloudService.uploadFromUri(data.image);
        return {
          data,
          imageData,
        };
      },
    ]);
  }

  isEthAddress(address: string) {
    return Web3.utils.isAddress(address);
  }
}

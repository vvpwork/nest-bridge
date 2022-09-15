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
import { DEFAULT_ETH_ADDRESS } from '@/common/constants';
import { INftModel } from '@/db/interfaces';

const { secretKey, nodeUrl, erc1155proxyC2 } = config.blockChain;
@Injectable()
export class BlockchainService {
  private securitizeRegistryContract: Contract;
  private web3Instance: Web3;
  private cloudService: CloudinaryService;
  constructor() {
    this.cloudService = new CloudinaryService();
    this.connect();
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
    const contract = new this.web3Instance.eth.Contract(erc1155abi, erc1155proxyC2);
    return contract.methods.isPartner(address).call();
  }

  /**
   * This method get past minted nfts from Collection smart contract
   * @param collectionAddress
   * @returns  -
   */
  async getPastCollectionNfts(collectionAddress: string): Promise<INftModel[]> {
    const contract = new this.web3Instance.eth.Contract(erc1155abi, collectionAddress);
    const pastEvents = await contract.getPastEvents('TransferSingle', {
      fromBlock: 10041528,
    });

    const mintedEvents = pastEvents
      .filter(event => event.returnValues.from === DEFAULT_ETH_ADDRESS)
      .map(ev => ({
        id: ev.returnValues.id,
        amount: ev.returnValues.value,
        owner: ev.returnValues.to,
      }));

    return Promise.all(
      mintedEvents.map(async v => {
        const info = await this.getDataForNFT(collectionAddress, v.id);
        const [royalties, royalty] = info.royalties[0];
        const [creators] = info.creators[0];

        return {
          ...v,
          collectionId: collectionAddress,
          thumbnail: info.metadata.imageData.thumbnail,
          metadata: info.metadata.data,
          totalSupply: 0,
          royalty,
          royaltyIds: [royalties],
          creatorIds: [creators],
        };
      }),
    );
  }

  /**
   * This method get necessary  NFT info from smartContracts
   * @param nftAddress
   * @param id
   * @returns  nft info
   */
  async getDataForNFT(nftAddress: string, id: number) {
    const collectionContract = new this.web3Instance.eth.Contract(erc1155abi, nftAddress);

    const [creators, royalties, metadata] = await Promise.all([
      collectionContract.methods.getCreators(id).call(),
      collectionContract.methods.getBridgeTowerRoyalties(id).call(),
      await (async () => {
        const uri = await collectionContract.methods.uri(id).call();
        const data: any = await getAxiosInstance(uri).get('');
        const imageData = await this.cloudService.uploadFromUri(data.image);
        return {
          data,
          imageData,
        };
      })(),
    ]);

    return {
      creators,
      royalties,
      metadata,
    };
  }

  isEthAddress(address: string) {
    return Web3.utils.isAddress(address);
  }
}

import Web3 from 'web3';
import { Logger } from '@nestjs/common';
import { EventData } from 'web3-eth-contract';
import { erc1155abi } from '../abis/erc1155bridgeTowerProxy';
import { DEFAULT_ETH_ADDRESS } from '@/common/constants';
import { CloudinaryService } from '@/common/services/cloudinary.service';
import { INftModel } from '@/db/interfaces';
import { getAxiosInstance } from '@/common/utils';
import { TypeRpcCommand } from '../../rabbit/interfaces/enums';

export class BlockchainRabbitService {
  constructor(
    private readonly web3Instance: Web3,
    private cloudService: CloudinaryService,
  ) {}

  async handlerMessage(command: TypeRpcCommand, data: any) {
    switch (command) {
      case TypeRpcCommand.ADD_COLLECTION:
        return this.addCollection(data);

      default:
        Logger.error('Command is not found ');
        return Promise.resolve('Command is not found ');
    }
  }

  private async addCollection(data: any) {
    const nfts = await this.getPastCollectionNfts(data.collectionAddress);
  }

  /**
   * This method get past minted nfts from Collection smart contract
   * @param collectionAddress
   * @returns  -
   */
  async getPastCollectionNfts(collectionAddress: string): Promise<INftModel[]> {
    const contract = new this.web3Instance.eth.Contract(
      erc1155abi,
      collectionAddress,
    );
    const pastEvents = await contract.getPastEvents('TransferSingle', {
      fromBlock: 10041528,
    });

    const mintedEvents = pastEvents
      .filter(
        (event: EventData) => event.returnValues.from === DEFAULT_ETH_ADDRESS,
      )
      .map((ev: EventData) => ({
        id: ev.returnValues.id,
        amount: ev.returnValues.value,
        owner: ev.returnValues.to,
      }));

    return Promise.all(
      mintedEvents.map(async (v) => {
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
    const collectionContract = new this.web3Instance.eth.Contract(
      erc1155abi,
      nftAddress,
    );

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
}

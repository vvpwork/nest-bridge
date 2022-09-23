/* eslint-disable @typescript-eslint/typedef */
import Web3 from 'web3';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { erc1155abi } from '../abis/erc1155bridgeTowerProxy';
import { DEFAULT_ETH_ADDRESS } from '@/common/constants';
import { CloudinaryService } from '@/common/services/cloudinary.service';
import { IBlockchainIdentityAddress, INftModel } from '@/db/interfaces';
import { getAxiosInstance, Web3Instance } from '@/common/utils';
import { TypeRpcCommand } from '../../rabbit/interfaces/enums';
import { NftModel } from '@/db/models';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { upsertData } from '@/db/utils/helper';

@Injectable()
export class BlockchainRabbitService {
  private readonly web3Instance: Web3;
  private cloudService: CloudinaryService;
  constructor(@InjectModel(NftModel) private repository: typeof NftModel) {
    this.cloudService = new CloudinaryService();
    this.web3Instance = Web3Instance.getInstance();
  }

  async handlerMessage(command: TypeRpcCommand, data: any) {
    switch (command) {
      case TypeRpcCommand.ADD_COLLECTION:
        return (async () => {
          this.addCollection(data);
          return 'run process to get NFT';
        })();
      // return 'ADD_COLLECTION';

      default:
        Logger.error('Command is not found ');
        return Promise.resolve('Command is not found ');
    }
  }

  private async addCollection(data: any) {
    const nfts = await this.getPastCollectionNfts(data.addresses[0]);
    await this.fillNftsByCollection(nfts, data.identityId);
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
      .filter((event) => event.returnValues.from === DEFAULT_ETH_ADDRESS)
      .map((ev) => ({
        id: ev.returnValues.id,
        amount: ev.returnValues.value,
        owner: ev.returnValues.to,
      }));

    return Promise.all(
      mintedEvents.map(async (v) => {
        const info = await this.getDataForNFT(collectionAddress, v.id);
        const [royalties, royalty] = info.royalties[0];
        const [creators] = info.creators[0];
        const identityAddress = await this.findIdentityByAddress(v.owner);
        Logger.log(identityAddress, 'nfts identityFromDb');

        const ownerBalance = await contract.methods
          .balanceOf(v.owner, v.id)
          .call();

        return {
          ...v,
          identityId: identityAddress.identityId,
          ownerBalance,
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

  /**
   * fill nfts after add collection, only ones
   * @param nfts
   */
  public async fillNftsByCollection(nfts: INftModel[], identityId?: string) {
    const { tableName } = this.repository;

    if (nfts && nfts.length) {
      Logger.log(
        '[BlockchainRabbitService] start fill db by nfts',
        nfts.length,
      );
      try {
        this.repository.sequelize.transaction(async (t) => {
          const nftsQuery = upsertData(
            tableName,
            [
              'id',
              'collectionId',
              'thumbnail',
              'amount',
              'metadata',
              'creatorIds',
              'royaltyIds',
              'royalty',
              'totalSupply',
            ],
            nfts.map((nft: INftModel) => [
              `'${nft.id}','${nft.collectionId}','${nft.thumbnail}','${
                nft.amount
              }', '${JSON.stringify(nft.metadata)}', '${JSON.stringify(
                nft.creatorIds,
              )}','${JSON.stringify(nft.royaltyIds)}',${nft.royalty}, '${
                nft.totalSupply
              }'`,
            ]),
          );
          await this.repository.sequelize.query(nftsQuery, { transaction: t });

          // add balances
          const balancesQuery = upsertData(
            'IdentityNftBalance',
            ['id', 'identityId', 'nftId', 'amount'],
            nfts.map((nft: INftModel) => [
              `'${getShortHash(nft.identityId, nft.id)}','${nft.identityId}','${
                nft.id
              }','${nft.ownerBalance}'`,
            ]),
          );

          await this.repository.sequelize.query(balancesQuery, {
            transaction: t,
          });
          // add creators
          const creatorsQuery = upsertData(
            'IdentityNftCreator',
            ['address', 'nftId'],
            nfts.map((cr: INftModel) => [`'${cr.creatorIds[0]}','${cr.id}'`]),
          );

          await this.repository.sequelize.query(creatorsQuery, {
            transaction: t,
          });

          const transactionHistoryQuery = upsertData(
            'TransactionHistory',
            ['identityId', 'nftId', 'amount', 'type'],
            nfts.map((m) => [
              `'${m.identityId}', '${m.id}', '${m.amount}', 'mint'`,
            ]),
          );

          console.log(transactionHistoryQuery);
          await this.repository.sequelize.query(transactionHistoryQuery, {
            transaction: t,
          });

          Logger.log('[BlockchainRabbitService] finish fill db');
        });
      } catch (err) {
        Logger.error(err, 'Fill db error');
      }
    }
  }

  async findIdentityByAddress(address: string) {
    const query = `
    SELECT * FROM BlockchainIdentityAddress  bc
    WHERE bc.address = '${address}'
    `;
    const [data] = await this.repository.sequelize.query(query);
    return data[0] as IBlockchainIdentityAddress;
  }
}

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/typedef */
import Web3 from 'web3';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contract } from 'web3-eth-contract';
import { erc1155abi } from '../abis/erc1155bridgeTowerProxy';
import { DEFAULT_ETH_ADDRESS } from '@/common/constants';
import { CloudinaryService } from '@/common/services/cloudinary.service';
import { IBlockchainIdentityAddress, INftModel } from '@/db/interfaces';
import { getAxiosInstance, Web3Instance } from '@/common/utils';
import { TypeRpcCommand } from '../../rabbit/interfaces/enums';
import { NftModel } from '@/db/models';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { upsertData } from '@/db/utils/helper';
import { IEventHandleData } from '../interfaces/blockchain-rabbit.interfsce';

@Injectable()
export class BlockchainRabbitService {
  private readonly web3Instance: Web3;
  private readonly web3InstanceWSS: Web3;
  private cloudService: CloudinaryService;
  constructor(@InjectModel(NftModel) private repository: typeof NftModel) {
    this.cloudService = new CloudinaryService();
    this.web3Instance = Web3Instance.getInstance();
    this.web3InstanceWSS = Web3Instance.getInstance('wss');
    this.listenToContractEvent('0x026DD3e8a7720D90c45f7415ab4BC42BE7f41743');
  }

  async handlerMessage(command: TypeRpcCommand, data: any) {
    switch (command) {
      case TypeRpcCommand.ADD_COLLECTION:
        return (async () => {
          await this.addCollection(data);
          return 'run process to get NFT';
        })();
      // return 'ADD_COLLECTION';

      default:
        Logger.error('Command is not found ');
        return Promise.resolve('Command is not found ');
    }
  }

  private async handleCollectionTransferEvent(
    ev: { returnValues: { [key: string]: any } },
    collectionAddress: string,
    contract: Contract,
  ) {
    const eventData: IEventHandleData = {
      id: ev.returnValues.id,
      amount: ev.returnValues.value,
      owner: ev.returnValues.to,
      seller: ev.returnValues.from,
      collectionId: collectionAddress,
    };
    const nft = await this.getNftInfo(eventData, contract);
    await this.fillNftsByCollection([nft]);
    Logger.log(
      '[BlockchainRabbit] add nft to collection ',
      nft.id,
      nft.collectionId,
      nft.owner,
    );
  }

  async getNftInfo(data: IEventHandleData, contract: Contract) {
    const info = await this.getDataForNFT(data.collectionId, data.id);
    const [royalties, royalty] = info.royalties[0];
    const [creators] = info.creators[0];
    const identityAddress = await this.findIdentityByAddress(data.owner);
    Logger.log(identityAddress, 'nfts identityFromDb');

    const ownerBalance = await contract.methods
      .balanceOf(data.owner, data.id)
      .call();

    return {
      ...data,
      identityId: identityAddress.identityId,
      ownerBalance,
      thumbnail: info.metadata.imageData.thumbnail,
      metadata: info.metadata.data,
      totalSupply: 0,
      royalty,
      royaltyIds: [royalties],
      creatorIds: [creators],
    };
  }

  async addCollection(data: { addresses: string[]; identityId?: string }) {
    await Promise.allSettled(
      data.addresses.map(async (address: string) => {
        try {
          console.log(address);
          const nfts = await this.getPastCollectionNfts(address);
          await this.fillNftsByCollection(nfts, data.identityId);
          console.log('finish');
          // this.listenToContractEvent(address);
        } catch (err) {
          console.log(err);
        }
      }),
    );
    return 'Added';
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
    const currentBlock = await this.web3Instance.eth.getBlockNumber();
    const pastEvents = await contract.getPastEvents('TransferSingle', {
      fromBlock: currentBlock - 2000,
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
  async getDataForNFT(nftAddress: string, id: number | string) {
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

  // TODO add all events
  listenToContractEvent = (address: string) => {
    const contract = new this.web3InstanceWSS.eth.Contract(erc1155abi, address);
    contract.events
      .TransferSingle(() => {})
      .on('data', (event: any) => {
        this.handleCollectionTransferEvent(event, address, contract);
      })
      .on('connected', (subscriptionId: string) => {
        Logger.log(subscriptionId, 'BlockchainRabbit listen to event  SubID: ');
      })
      .on('error', (error: Error, receipt: string) => {
        Logger.error(error, receipt, 'BlockchainRabbit Error:');
      });
    Logger.log(address, 'Blockchain added collection listener');
  };
}

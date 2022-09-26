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
import { getAxiosInstance, sleep, Web3Instance } from '@/common/utils';
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
  }

  async handlerRpcMessage(command: TypeRpcCommand, data: any) {
    switch (command) {
      case TypeRpcCommand.ADD_COLLECTION:
        return this.addCollectionHandler(data);

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
    const type =
      ev.returnValues.from === DEFAULT_ETH_ADDRESS ? 'mint' : 'transfer';

    if (type === 'transfer') return;

    const nft = await this.getNftInfo(
      {
        id: ev.returnValues.id,
        amount: ev.returnValues.value,
        owner: ev.returnValues.to,
        collectionId: collectionAddress,
      },
      contract,
    );
    await this.fillNftsByCollection([nft], type);
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

  addCollectionHandler(data: { addresses: string[]; identityId?: string }) {
    this.addCollection(data);
    this.listenToContractEvent(data.addresses[0]);
    return 'Start added process';
  }

  private async addCollection(data: {
    addresses: string[];
    identityId?: string;
  }) {
    const { addresses } = data;
    const nfts = await this.getPastCollectionNfts(addresses[0]);
    await this.fillNftsByCollection(nfts, 'mint');
  }

  private async getPastCollectionNfts(
    collectionAddress: string,
  ): Promise<INftModel[]> {
    const contract = new this.web3Instance.eth.Contract(
      erc1155abi,
      collectionAddress,
    );

    const pastEvents = await contract.getPastEvents('TransferSingle', {
      fromBlock: 13841000,
    });

    const mintedEvents = pastEvents
      .filter((event) => event.returnValues.from === DEFAULT_ETH_ADDRESS)
      .map((ev) => ({
        id: ev.returnValues.id,
        amount: ev.returnValues.value,
        owner: ev.returnValues.to,
      }));

    const data = await Promise.all(
      mintedEvents.map(async (v) => {
        const info = await this.getDataForNFT(collectionAddress, v.id);
        const [royalties, royalty] = info.royalties[0];
        const [creators] = info.creators[0];
        const identityAddress = await this.findIdentityByAddress(v.owner);
        Logger.log(identityAddress.id, 'owner identityId from db');

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
    return data;
  }

  async getDataForNFT(collectionAddress: string, nftId: number | string) {
    const collectionContract = new this.web3Instance.eth.Contract(
      erc1155abi,
      collectionAddress,
    );
    let uri = await collectionContract.methods.uri(nftId).call();
    Logger.log('first', uri);

    if (!uri) {
      await sleep(2000);
      uri = await collectionContract.methods.uri(nftId).call();
      Logger.log('second', uri);
    }

    if (!uri) {
      await sleep(4000);
      uri = await collectionContract.methods.uri(nftId).call();
      Logger.log('third', uri);
    }

    const getMetadata = async () => {
      const data: any = await getAxiosInstance(uri).get('');
      const imageData = await this.cloudService.uploadFromUri(data.image);
      return {
        data,
        imageData,
      };
    };
    const metadata = await getMetadata();

    const [creators, royalties] = await Promise.all([
      collectionContract.methods.getCreators(nftId).call(),
      collectionContract.methods.getBridgeTowerRoyalties(nftId).call(),
    ]);

    return {
      creators,
      royalties,
      metadata,
    };
  }

  public async fillNftsByCollection(
    nfts: INftModel[],
    type: 'mint' | 'transfer' = 'mint',
  ) {
    const { tableName } = this.repository;
    const reg = /'/g;
    if (nfts && nfts.length) {
      Logger.log(
        '[BlockchainRabbitService] start fill db by nfts',
        nfts.length,
      );
      try {
        this.repository.sequelize.transaction(async (t) => {
          console.log(nfts.map((v) => v.totalSupply));
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
              }', '${JSON.stringify({
                ...nft.metadata,
                name: nft.metadata.name.replace(reg, ''),
                description: nft.metadata.description.replace(reg, ''),
              })}', '${JSON.stringify(nft.creatorIds)}','${JSON.stringify(
                nft.royaltyIds,
              )}',${nft.royalty}, ${nft.totalSupply || nft.amount}`,
            ]),
          );
          await this.repository.sequelize.query(nftsQuery, { transaction: t });

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

          if (type === 'mint') {
            const creatorsQuery = upsertData(
              'IdentityNftCreator',
              ['id', 'address', 'nftId'],
              nfts.map((cr: INftModel) => [
                `'${getShortHash(cr.creatorIds[0], cr.id)}', '${
                  cr.creatorIds[0]
                }','${cr.id}'`,
              ]),
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
            await this.repository.sequelize.query(transactionHistoryQuery, {
              transaction: t,
            });
            Logger.log('[BlockchainRabbitService] save mint data');
          }

          Logger.log('[BlockchainRabbitService] finish fill db', nfts.length);
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
    const contractRpc = new this.web3Instance.eth.Contract(erc1155abi, address);
    contract.events
      .TransferSingle(() => {})
      .on('data', (event: any) => {
        this.handleCollectionTransferEvent(event, address, contractRpc);
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

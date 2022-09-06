import { MetadataObject, ProfileSocials } from '@Common/types';
import { ACCOUNT_TYPES, BALANCE_STATUSES, NOTIFICATION_TYPES, PROFILE_SECTIONS } from '@Common/enums';

export interface IConfig {
  db: {
    host: string;
    port: number;
    password: string;
    database: string;
    username: string;
    dialect: any;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  rabbit: {
    uri: string;
    exchangeName: string;
  };
  jwt: {
    secret: string;
    ttl: string | number;
  };
  securitize: {
    issuerId: string;
    secret: string;
    baseUrl: string;
    proxyAddress: string;
  };
  blockChain: {
    nodeUrl: string;
    erc1155Proxy: string;
    exchangeV2Proxy: string;
    artemundiWallet: string;
    transferProxy: string;
    erc20proxy: string;
    secretKey: string;
  };
}

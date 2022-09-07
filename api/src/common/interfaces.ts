import { Request } from '@nestjs/common';

export interface IConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
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
    exchangeNameRpc: string;
    exchangeNameDefault: string;
    timeoutDelay: number;
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

export interface IRequest extends Request {
  user: any;
}

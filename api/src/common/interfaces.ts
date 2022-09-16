import { Request } from 'express';
import BigNumber from 'bignumber.js';
import { IIdentityModel } from '@DB/interfaces';
import { IdentityModel } from '@DB/models';

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
    erc1155proxyC2: string;
  };
  cloudinary: {
    name: string;
    apiKey: string;
    apiSecret: string;
  };
  nft: {
    lockPeriod: number;
  };
}

export interface IUserRequest extends Request {
  user: { data: IIdentityModel };
}

export interface IRequest extends Request {
  user: any;
}

export interface ICloudinaryUploadFileResponseData {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  api_key: string;
}

export interface IBigNumberUtile {
  /**
   * This method handle general big number to format which we can show to
   * client
   * @param precision - number of precision after come
   * @example
   *
   *  new BN(1000000).toViewUSDC() => 1,00
   *
   */
  toView(precision?: number): string;

  /**
   *
   * This method transform amount to amount with needed decimals
   *
   * @param decimal - number of decimals default 6
   * @param type - type tu return default 'string'
   *
   * @example
   *
   * new BN(1).toBaseUnitAmount(4, 'string') =>  '10000'
   * new BN(1).toBaseUnitAmount(4, 'bn') =>  instance of Bignumber
   */
  toBaseUnitAmount(decimal?: number, type?: 'bn' | 'string'): string | BigNumber;

  /**
   * This method transforms amount to amount without decimals
   *
   * @param decimal - number of decimals default 6
   * @param type - type tu return default 'string'
   *
   * @example
   *
   * new BN(1).toBaseUnitAmount(4, 'string') =>  '10000'
   * new BN(1).toBaseUnitAmount(4, 'bn') =>  instance of Bignumber
   */
  toUnitAmount(decimal?: number, type?: 'bn' | 'string'): string | BigNumber;
}

export interface IUserInterface {
  data: IIdentityModel;
  tokenData: { sub: string; token: string; [key: string]: any };
}

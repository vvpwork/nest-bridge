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
  cloudinary: {
    name: string;
    apiKey: string;
    apiSecret: string;
  };
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

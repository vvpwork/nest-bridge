export interface IConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  triggerTime: string;
  db: {
    host: string;
    port: number;
    password: string;
    database: string;
    username: string;
    dialect: any;
  };
  blockchain: {
    nodeUrl: string;
    erc1155Proxy: string;
    exchangeV2Proxy: string;
    artemundiWallet: string;
    transferProxy: string;
    erc20proxy: string;
    secretKey: string;
    erc1155proxyC2: string;
  };
  rabbit: {
    uri: string;
    exchangeNameRpc: string;
    exchangeNameDefault: string;
    timeoutDelay: number;
  };
  securitize: {
    issuerId: string;
    secret: string;
    baseUrl: string;
    proxyAddress: string;
  };
  cloudinary: {
    name: string;
    apiKey: string;
    apiSecret: string;
  };
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

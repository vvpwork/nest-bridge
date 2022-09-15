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
}

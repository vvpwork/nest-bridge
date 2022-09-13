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
  };
  rabbit: {
    uri: string;
    exchangeNameRpc: string;
    exchangeNameDefault: string;
    timeoutDelay: number;
  };
}

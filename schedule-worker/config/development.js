const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number.parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV,
  triggerTime: process.env.TRIGGER_TIME,
  db: {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    dialect: process.env.DB_DIALECT,
    schema: process.env.DB_SCHEMA,
  },
  blockchain: {
    nodeUrl: process.env.NODE_URL,
    erc1155Proxy: process.env.ERC1155_BRIDGE_TOWER_PROXY_ADDRESS,
    exchangeV2Proxy: process.env.EXCHANGE_V2_PROXY_ADDRESS,
    artemundiWallet: process.env.ARTEMUNDI_WALLET_ADDRESS,
    transferProxy: process.env.TRANSFER_PROXY_ADDRESS,
    erc20proxy: process.env.ERC_20_TRANSFER_PROXY_ADDRESS,
    secretKey: process.env.WALLET_SECRET_KEY,
  },
  rabbit: {
    uri: process.env.RABBIT_URI,
    exchangeNameRpc: process.env.RABBIT_EXCHANGE_NAME_RPC,
    exchangeNameDefault: process.env.RABBIT_EXCHANGE_NAME_DEFAULT,
    timeoutDelay: process.env.MESSAGE_TIMEOUT || 6000,
  },
};

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number.parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_EXPIRE_TIME,
  },
  db: {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    dialect: process.env.DB_DIALECT,
    schema: process.env.DB_SCHEMA,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  rabbit: {
    uri: process.env.RABBIT_URI,
    exchangeNameRpc: process.env.RABBIT_EXCHANGE_NAME_RPC,
    exchangeNameDefault: process.env.RABBIT_EXCHANGE_NAME_DEFAULT,
    timeoutDelay: process.env.MESSAGE_TIMEOUT || 6000,
  },
  securitize: {
    issuerId: process.env.SECURITIZE_ISSUER_ID,
    secret: process.env.SECURITIZE_SECRET,
    baseUrl: process.env.SECURITIZE_API_BASE_URL,
    proxyAddress: process.env.SECURITIZE_REGISTRY_PROXY_ADDRESS,
  },
  blockChain: {
    nodeUrl: process.env.NODE_URL,
    erc1155proxyC2: process.env.ERC1155_BRIDGE_TOWER_FACTORY_C2_ADDRESS,
    exchangeV2Proxy: process.env.EXCHANGE_V2_PROXY_ADDRESS,
    artemundiWallet: process.env.ARTEMUNDI_WALLET_ADDRESS,
    transferProxy: process.env.TRANSFER_PROXY_ADDRESS,
    erc20proxy: process.env.ERC_20_TRANSFER_PROXY_ADDRESS,
    secretKey: process.env.WALLET_SECRET_KEY,
    structuredStakingProxy: process.env.STRUCTURED_STAKING_PROXY
  },
  cloudinary: {
    name: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUD_API_KEY,
    apiSecret: process.env.CLOUD_API_SECRET,
  },
  nft: {
    lockPeriod: process.env.NFT_LOCKING_PERIOD_IN_SECONDS,
  },
};

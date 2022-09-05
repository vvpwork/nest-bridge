const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number.parseInt(process.env.PORT || '3000', 10),
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
    exchangeName: process.env.RABBIT_EXCHANGE_NAME,
  },
  securitize: {
    issuerId: process.env.SECURITIZE_ISSUER_ID,
    secret: process.env.SECURITIZE_SECRET,
    baseUrl: process.env.SECURITIZE_API_BASE_URL,
    proxyAddress: process.env.SECURITIZE_REGISTRY_PROXY_ADDRESS,
  },
};

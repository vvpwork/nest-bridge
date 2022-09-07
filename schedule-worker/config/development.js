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
};

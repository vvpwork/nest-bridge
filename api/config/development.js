const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: Number.parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '54380', 10),
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres',
    dialect: process.env.DB_TYPE || 'postgres',
    schema: process.env.DB_SCHEMA || 'public'
  },
};

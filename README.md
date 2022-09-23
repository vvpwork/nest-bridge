# Bridge tower services

## Summary

---

Bridge Tower api services

## System requirements

---

To be able to setup system locally you should have installed next dependencies:

1. [Docker 20^](https://docs.docker.com/)
2. [docker-compose 1.26^](https://docs.docker.com/compose/gettingstarted/)
3. [MariaDB](https://mariadb.com/)
4. [NodeJS 16.14^](https://nodejs.org/uk/)
5. [RabbitMQ](https://www.rabbitmq.com/)
6. [Redis](https://redis.io/)

## Running Local Environment

1. Install the packages

   `yarn`

2. Run  MariaDB, Redis and Rabbit locally:

   `docker compose -f docker-compose-local.yml up -Vd`;

3. Start the application on development mode

   `cd ./api &&  yarn && yarn dev`
   `cd ./blockchain-scedule-worker && yarn &&  yarn dev`

## Running server Environment

1. Install the packages:

   `yarn`

2. Setup env:

   `NODE_ENV=production ....and others`

3. Run by docker-compose (before check all env in docker-compose.yml and setup current ports for the api service):

   `docker-compose up -Vd --build`

### Summary

As a git flow we're using the basic pipeline:

1. Create new branch from `develop`
2. Do changes
3. Commit & Push changes to **your new branch**
4. Create a new PR [here](https://github.com/medmoinc/medmo-api/pulls) with base `develop`
5. Wait for review
6. You changes successfully merged to _Staging_ env

### Testing

To make deploy on the test environment should be created a new PR from `develop` to `test`

### Staging

To make deploy on the stage environment should be created a new PR from `develop` to `master`

## ENV Variables

---

**Important**

All secrets are sharing only throw [1password](https://1password.com/) or [bitwarden](https://bitwarden.com/)
Next can be fount the list of all env variables.

| Name                         | is required | description                              |   default                |
| -----------------            | ----------- | ---------------------------------------- | ------------------------ |
| PORT                         |  True       | port where the api will running          |   8000
| NODE_ENV                     |  True       | (development, production test)           |   development
| BASE_URL                     |  False      |  base url for webHooks                   |  <http://localhost:8000>  |
|                              `**** JWT`
| JWT_SECRET                   | True        |  secret for sign jwt                     | test                     |  
| JWT_EXPIRE_TIME              | True        |  time to expire jwt                      | id                       |  
| JWT_EXPIRE_TIME              | True        |  time to expire jwt                      | id                       |  
|                              `**** DB mariadb`
| DB_HOST                      | True        | db host                                  | localhost
| DB_PORT                      | True        | db port                                  |3306
| DB_PASSWORD                  | True        | db password                              | bridge2022
| DB_NAME                      | True        | name db                                  | bridge_db
| DB_USER                      | True        | db user name                             | bridge
| DB_DIALECT                   | True        | dialect fro sequelize                    | mariadb
| DB_SCHEMA                    | True        | schema for db                            | bridge_db
|                              `**** Redis`
| REDIS_HOST                   | True        | host for redis                           | localhost
| REDIS_PORT                   | True        | redis port                               | 6379
|                              `**** RabbitMQ`
| RABBIT_URI                   | True        | rabbit uri                               | amqp://localhost
| RABBIT_EXCHANGE_NAME_RPC     | True        | name exchange for rpc call               | rpc_exchange
| RABBIT_EXCHANGE_NAME_DEFAULT | True        | name for event                           | default_exchange
| MESSAGE_TIMEOUT              | True        | time to wait answer between services     | 6000
| ## Securitize
| SECURITIZE_ISSUER_ID         | True        | securitize issuer id                     | 44ed2a58-98ef-408c-b721-11760ba736a0
| SECURITIZE_SECRET            | True        | secret                                   | c0d585e4-d7a8-4501-92bd-ece229e4f5be
| SECURITIZE_API_BASE_URL      | True        | sec base url                             | <https://connect-gw.sandbox.securitize.io/api>
| SECURITIZE_REGISTRY_PROXY_ADDRESS | True | proxy address |  0xD32F4F0d7aB4A4D88831c05d402c4a1AF4b698F3
|                              `**** Blockchain`
| NODE_URL                     | True        | base node url                             | <https://nd-927-860-543.p2pify.com/c808ffb978332ba7e99704f6c41a22bf/ext/bc/C/rpc>
| ARTEMUNDI_WALLET_ADDRESS     | True        | address artemund                          | i0x423cbE3E6479E86dfb816915c5BF57060e48C5A7
| WALLET_SECRET_KEY            | True        | secret for defaul                         | wallet5ce0b20427fe6a03e218c053bb123a213229e8b48e96b208d1be86d3b8173fdd
| ERC1155_BRIDGE_TOWER_FACTORY_C2_ADDRESS | True      | root factory                     | 0xb53270e658FF1a6EDD4fC205A871E53f016d1b8D
| EXCHANGE_V2_PROXY_ADDRESS    | True        | proxy V2                                  | address0x2e74b7d50563Cda092b7c5890Ef76E25CB661442
| TRANSFER_PROXY_ADDRESS       | True        | transfer proxy                            | 0x1B5A812e35a47C351200eA8f16A94a9B892a4C45
| STRUCTURED_STAKING_PROXY     | True        | stacking proxy                            | 0x1B5A812e35a47C351200eA8f16A94a9B892a4C45
| ERC_20_TRANSFER_PROXY_ADDRESS| True        | erc20 proxy                               |0xDC086248188B455beB103Ba44f401D0aD8f93eb9
|                               `**** NFT`
| NFT_LOCKING_PERIOD_IN_SECOND | True        | time to lock nft (seconds)                | 360
|                               `**** Cloudinary`
| CLOUD_NAME                   | True        | name cloudinary                           | bridgetowercapital
| CLOUD_API_KEY                | True        | api key                                   | 981927427522746
|CLOUD_API_SECRET              | True        | secret                                    | _t7QbeziDGD5ib4b7AYhPmX7J0Y

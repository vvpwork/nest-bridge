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
| BASE_URL                     |  False      |  base url for webHooks                   |  http://localhost:8000    |

## JWT

JWT_SECRET=test
JWT_EXPIRE_TIME=1d

## DB mariadb

DB_HOST=localhost
DB_PORT=3306
DB_PASSWORD=bridge2022
DB_NAME=bridge_db
DB_USER=bridge
DB_DIALECT=mariadb
DB_SCHEMA=bridge_db

## Redis

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

## RabbitMQ

RABBIT_URI=amqp://localhost
RABBIT_EXCHANGE_NAME=nestTest
RABBIT_EXCHANGE_NAME_RPC=rpc_exchange
RABBIT_EXCHANGE_NAME_DEFAULT=default_exchange
MESSAGE_TIMEOUT=6000

## Securitize

SECURITIZE_ISSUER_ID=44ed2a58-98ef-408c-b721-11760ba736a0
SECURITIZE_SECRET=c0d585e4-d7a8-4501-92bd-ece229e4f5be
SECURITIZE_API_BASE_URL=<https://connect-gw.sandbox.securitize.io/api>
SECURITIZE_REGISTRY_PROXY_ADDRESS=0xD32F4F0d7aB4A4D88831c05d402c4a1AF4b698F3

## Blockchain

NODE_URL= <https://nd-927-860-543.p2pify.com/c808ffb978332ba7e99704f6c41a22bf/ext/bc/C/rpc>
ARTEMUNDI_WALLET_ADDRESS=0x423cbE3E6479E86dfb816915c5BF57060e48C5A7
WALLET_SECRET_KEY=5ce0b20427fe6a03e218c053bb123a213229e8b48e96b208d1be86d3b8173fdd
ERC1155_BRIDGE_TOWER_FACTORY_C2_ADDRESS=0xb53270e658FF1a6EDD4fC205A871E53f016d1b8D
EXCHANGE_V2_PROXY_ADDRESS=0x2e74b7d50563Cda092b7c5890Ef76E25CB661442
TRANSFER_PROXY_ADDRESS=0x1B5A812e35a47C351200eA8f16A94a9B892a4C45
ERC_20_TRANSFER_PROXY_ADDRESS=0xDC086248188B455beB103Ba44f401D0aD8f93eb9

## NFT

NFT_LOCKING_PERIOD_IN_SECONDS=360
NFT_UNLOCKING_SOON_PERIOD_IN_SECONDS=120

## Cloudinary

CLOUD_NAME=bridgetowercapital
CLOUD_API_KEY=981927427522746
CLOUD_API_SECRET=_t7QbeziDGD5ib4b7AYhPmX7J0Y

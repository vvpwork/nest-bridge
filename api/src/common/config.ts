import nodeConfig from 'config';
import { IConfig } from './interfaces';

export const config: IConfig = {
  db: nodeConfig.get('db'),
  redis: nodeConfig.get('redis'),
  rabbit: nodeConfig.get('rabbit'),
  jwt: nodeConfig.get('jwt'),
  securitize: nodeConfig.get('securitize'),
  blockChain: nodeConfig.get('blockChain'),
};

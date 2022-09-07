import nodeConfig from 'config';
import { IConfig } from './interfaces';

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  port: nodeConfig.get('port'),
  db: nodeConfig.get('db'),
  triggerTime: nodeConfig.get('triggerTime'),
};

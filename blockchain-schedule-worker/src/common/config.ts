import nodeConfig from 'config';
import { IConfig } from './interfaces';

export const config: IConfig = {
  nodeEnv: nodeConfig.get('nodeEnv'),
  port: nodeConfig.get('port'),
  db: nodeConfig.get('db'),
  rabbit: nodeConfig.get('rabbit'),
  triggerTime: nodeConfig.get('triggerTime'),
  blockchain: nodeConfig.get('blockchain'),
  securitize: nodeConfig.get('securitize'),
  cloudinary: nodeConfig.get('cloudinary'),
};

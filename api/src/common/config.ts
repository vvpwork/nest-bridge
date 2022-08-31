import nodeConfig from 'config';
import { IConfig } from './interfaces';

export const config: IConfig = {
  db: nodeConfig.get('db'),
};

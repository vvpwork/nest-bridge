import nodeConfig from 'config';

export const config = {
  db: nodeConfig.get('db'),
};

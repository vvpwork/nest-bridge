import { SEQUELIZE } from '@Common/constants';
import { config } from '@Common/config';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';
import * as models from '@DB/models';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        ...config.db,
        logging: Logger.log,
      });
      sequelize.addModels(Object.values(models));
      return sequelize;
    },
  },
];

// TODO refactor repository
export const MODEL_PROVIDERS_ALIAS = Object.keys(models).map((name: string) => {
  const providerAlias = name
    .split(/(?=[A-Z])/)
    .map((v: string) => v.toUpperCase())
    .join('_');

  return {
    provide: providerAlias,
    useValue: models[name],
  };
});

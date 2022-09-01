import { Sequelize } from 'sequelize-typescript';
import { config } from '@Common/config';
import { ProfileEntity } from '@/db/models/Profile.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(config.db);
      sequelize.addModels([ProfileEntity]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

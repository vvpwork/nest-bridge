const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async queryInterface => {
    // console.log('scv_q', queryInterface);
    await queryInterface.bulkUpsert(
      { tableName: 'AccountType', schema: db.schema },
      [
        {
          code: 'user',
        },
        {
          code: 'partner',
        },
        {
          code: 'admin',
        },
      ],
      {
        updateOnDuplicate: ['code'],
      },
    );
  },

  down: queryInterface => queryInterface.bulkDelete({ tableName: 'AccountType', schema: db.schema }, { where: {}, truncate: true }),
};

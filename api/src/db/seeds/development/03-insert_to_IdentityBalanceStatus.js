const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert({ tableName: 'IdentityNftBalanceStatus', schema: db.schema }, [
      {
        code: 'sold',
      },
    ]);
  },

  down: queryInterface =>
    queryInterface.bulkDelete({ tableName: 'IdentityNftBalanceStatus', schema: db.schema }, { where: {}, truncate: true }),
};

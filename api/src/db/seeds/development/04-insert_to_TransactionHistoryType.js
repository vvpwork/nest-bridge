const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert({ tableName: 'TransactionHistoryType', schema: db.schema }, [
      {
        code: 'buy',
      },
      {
        code: 'sell',
      },
      {
        code: 'mint',
      },
      {
        code: 'list',
      },
      {
        code: 'unList',
      },
      {
        code: 'priceUpdate',
      },
      {
        code: 'royaltyReceived',
      },
    ]);
  },

  down: queryInterface =>
    queryInterface.bulkDelete({ tableName: 'TransactionHistoryType', schema: db.schema }, { where: {}, truncate: true }),
};

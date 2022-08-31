const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({ tableName: 'TransactionHistoryType', schema: db.schema }, {
      code: {
        type: Sequelize.STRING(32),
        allowNull: false,
        primaryKey: true,
      },
    });
    // TODO remove from here

    await queryInterface.bulkInsert(
      'TransactionHistoryType',
      [ {
          code: 'buy'
        },
        {
          code: 'sell'
        },
        {
          code: 'mint'
        },
        {
          code: 'list'
        },
        {
          code: 'unlist'
        },
        {
          code: 'priceUpdate'
        },
        {
          code: 'royaltyReceived'
        },
      ]
    );
  },

  down: (queryInterface) => queryInterface.dropTable('TransactionHistoryType'),
};

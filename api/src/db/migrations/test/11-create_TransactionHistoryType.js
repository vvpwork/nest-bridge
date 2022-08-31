module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionHistoryType', {
      code: {
        type: Sequelize.STRING(32),
        allowNull: false,
        primaryKey: true,
      },
    });

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

/* eslint-disable */
const { upsertData } = require('../../utils/helper');

module.exports = {
  up: async queryInterface => {
    const transactionHistoryTypes = [
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
    ];

    const transactionHistoryTypesQuery = upsertData(
      'TransactionHistoryType',
      ['code'],
      transactionHistoryTypes.map(tr => [`'${tr.code}'`]),
      'code',
    );

    await queryInterface.sequelize.query(transactionHistoryTypesQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('TransactionHistoryType'),
};

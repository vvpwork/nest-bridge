const { upsertData } = require('../../utils/helper');

module.exports = {
  up: async queryInterface => {
    const balanceStatuses = [
      {
        code: 'sold',
      },
    ];

    const balanceStatusesQuery = upsertData(
      'IdentityNftBalanceStatus',
      ['code'],
      balanceStatuses.map(tr => [`'${tr.code}'`]),
      'code',
    );

    await queryInterface.sequelize.query(balanceStatusesQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('IdentityNftBalanceStatus'),
};

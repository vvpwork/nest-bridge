const { upsert } = require('../../utils/upsert.helper');

module.exports = {
  up: async queryInterface => {
    const balanceStatuses = [
      {
        code: 'sold',
      },
    ];

    const balanceStatusesQuery = upsert(
      'IdentityNftBalanceStatus',
      ['code'],
      balanceStatuses.map(tr => [`'${tr.code}'`]),
      'code',
    );

    await queryInterface.sequelize.query(balanceStatusesQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('IdentityNftBalanceStatus'),
};

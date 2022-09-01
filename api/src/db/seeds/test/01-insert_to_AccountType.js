const { upsert } = require('../../utils/upsert.helper');

module.exports = {
  up: async queryInterface => {
    const accountTypes = [
      {
        code: 'user',
      },
      {
        code: 'partner',
      },
    ];

    const accountTypeQuery = upsert(
      'AccountType',
      ['code'],
      accountTypes.map(tr => [`'${tr.code}'`]),
      'code',
    );

    await queryInterface.sequelize.query(accountTypeQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('AccountType'),
};

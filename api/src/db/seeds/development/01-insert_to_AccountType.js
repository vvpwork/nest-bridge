/* eslint-disable */
const { upsertData } = require('../../utils/helper');

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

    const accountTypeQuery = upsertData(
      'AccountType',
      ['code'],
      accountTypes.map(tr => [`'${tr.code}'`]),
    );

    await queryInterface.sequelize.query(accountTypeQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('AccountType'),
};

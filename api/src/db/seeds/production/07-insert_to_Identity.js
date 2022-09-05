/* eslint-disable */
const { upsertData, resetSequence } = require('../../utils/helper');

module.exports = {
  up: async queryInterface => {
    const identitites = [
      {
        id: 1,
        address: '0xtestAddress1',
        securitizeId: 'dfgdhfjg33333ukjthdrgsefa',
        accountType: 'user',
        profileId: 1,
        nonce: 123456,
      },
      {
        id: 2,
        address: '0xtestAddress222',
        securitizeId: 'dfgdhfjg33333ukjthdrgsefa',
        accountType: 'user',
        profileId: 2,
        nonce: 123456,
      },
      {
        id: 3,
        address: '0xtestAddress3333',
        securitizeId: 'dfgdhfjg33333ukjthdrgsefa',
        accountType: 'partner',
        profileId: 3,
        nonce: 123456,
      },
    ];

    const identitiesQuery = upsertData(
      'Identity',
      ['id', 'address', 'securitizeId', 'accountType', 'profileId', 'nonce'],
      identitites.map(tr => [`'${tr.id}','${tr.address}','${tr.securitizeId}','${tr.accountType}','${tr.profileId}','${tr.nonce}'`]),
    );

    await queryInterface.sequelize.query(identitiesQuery);

    await resetSequence(queryInterface, 'Identity');
  },

  down: queryInterface => queryInterface.bulkDelete('Profile'),
};

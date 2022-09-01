const { upsert } = require('../../utils/upsert.helper');

module.exports = {
  up: async queryInterface => {
    const notificationTypes = [
      {
        code: 'nftSold',
      },
      {
        code: 'royaltyReceived',
      },
      {
        code: 'followingPersonListsNft',
      },
      {
        code: 'followingPersonAddedNews',
      },
      {
        code: 'followingPersonAddedPodcast',
      },
      {
        code: 'followingPersonAddedLibrary',
      },
      {
        code: 'nftsUnlocked',
      },
      {
        code: 'newFollower',
      },
    ];

    const notificationTypesQuery = upsert(
      'NotificationType',
      ['code'],
      notificationTypes.map(tr => [`'${tr.code}'`]),
      'code',
    );

    await queryInterface.sequelize.query(notificationTypesQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('NotificationType'),
};

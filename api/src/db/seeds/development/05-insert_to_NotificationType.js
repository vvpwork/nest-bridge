const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert({ tableName: 'NotificationType', schema: db.schema }, [
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
    ]);
  },

  down: queryInterface => queryInterface.bulkDelete({ tableName: 'NotificationType', schema: db.schema }, { where: {}, truncate: true }),
};

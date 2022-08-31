module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NotificationType', {
      code: {
        type: Sequelize.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
    });

    await queryInterface.bulkInsert(
      'NotificationType',
      [ {
          code: 'nftSold'
        },
        {
          code: 'royaltyReceived'
        },
        {
          code: 'followingPersonListsNft'
        },
        {
          code: 'followingPersonAddedNews'
        },
        {
          code: 'followingPersonAddedPodcast'
        },
        {
          code: 'followingPersonAddedLibrary'
        },
        {
          code: 'nftsUnlocked'
        },
        {
          code: 'newFollower'
        },
      ]
    );
  },

  down: (queryInterface) => queryInterface.dropTable('NotificationType'),
};

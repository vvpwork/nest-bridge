module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Nft', {
      id: {
        type: Sequelize.STRING(60),
        allowNull: false,
        primaryKey: true,
      },
      collectionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Collection',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      tokenId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      totalSupply: {
        type: Sequelize.INTEGER,
        allowNull: false,
        description: 'The maximum tokens amount that can be ever minted',
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        description: 'The tokens amount that actually were minted',
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true,
        description: 'An image of NFT, the same as in metadata.image, but minimized and uploaded to the cloud',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: (queryInterface) => queryInterface.dropTable('Nft'),
};

const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Nft', schema: db.schema },
      {
        id: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        royalty: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        collectionId: {
          type: Sequelize.STRING,
          references: {
            model: 'Collection',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        royaltyIds: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        creatorIds: {
          type: Sequelize.JSON,
          allowNull: true,
        },

        metadata: {
          type: Sequelize.JSON,
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
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Nft', schema: db.schema }),
};

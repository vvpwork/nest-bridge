const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'NftLike', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },

        profileId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Profile',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },

        nftId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'Nft',
            key: 'id',
          },
          onDelete: 'CASCADE',
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

    queryInterface.addConstraint(
      { tableName: 'NftLike', schema: db.schema },
      {
        fields: ['profileId', 'nftId'],
        type: 'unique',
        name: 'constraint_profileId_nftId',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'NftLike', schema: db.schema }),
};

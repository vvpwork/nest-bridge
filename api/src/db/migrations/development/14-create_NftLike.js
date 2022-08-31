const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({ tableName: 'NftLike', schema: db.schema }, {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      identityId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Identity',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      nftId: {
        type: Sequelize.STRING(60),
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
    });

    queryInterface.addConstraint('NftLike', {
      fields: ['identityId', 'nftId'],
      type: 'unique',
      name: 'constraint_identityId_nftId',
    });
  },

  down: (queryInterface) => queryInterface.dropTable('NftLike'),
};

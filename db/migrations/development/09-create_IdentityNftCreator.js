const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'IdentityNftCreator', schema: db.schema },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        address: {
          type: Sequelize.STRING,
          references: {
            model: 'BlockchainIdentityAddress',
            key: 'address',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },

        nftId: {
          type: Sequelize.STRING,
          references: {
            model: 'Nft',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
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
    await queryInterface.addConstraint(
      { tableName: 'IdentityNftCreator', schema: db.schema },
      {
        type: 'UNIQUE',
        fields: ['address', 'nftId'],
        name: 'unique_creatorNft',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'IdentityNftCreator', schema: db.schema }),
};

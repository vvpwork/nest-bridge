const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'IdentityNftCreator', schema: db.schema },
      {
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
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'IdentityNftBalance', schema: db.schema }),
};

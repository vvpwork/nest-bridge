const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'IdentityNftBalance', schema: db.schema },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        identityId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Identity',
            key: 'id',
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
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        status: {
          type: Sequelize.STRING,
          references: {
            model: 'IdentityNftBalanceStatus',
            key: 'code',
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
      { tableName: 'IdentityNftBalance', schema: db.schema },
      {
        type: 'UNIQUE',
        fields: ['identityId', 'nftId'],
        name: 'unique_identityNftBalance',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'IdentityNftBalance', schema: db.schema }),
};

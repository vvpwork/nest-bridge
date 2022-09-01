const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Order', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        identityId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Identity',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        nftId: {
          type: Sequelize.STRING(60),
          allowNull: false,
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
        price: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        decimals: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        signature: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        metadata: {
          type: Sequelize.JSONB,
          allowNull: false,
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

  down: queryInterface => queryInterface.dropTable({ tableName: 'Order', schema: db.schema }),
};

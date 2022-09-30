const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Orders', schema: db.schema },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        nftIdentityBalanceId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'IdentityNftBalance',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        currency: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'Currencies',
            key: 'symbol',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        price: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        signature: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        metadata: {
          type: Sequelize.JSON,
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

  down: queryInterface => queryInterface.dropTable({ tableName: 'Orders', schema: db.schema }),
};

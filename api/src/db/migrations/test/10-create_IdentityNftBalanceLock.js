const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'IdentityNftBalanceLock', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        identityNftBalanceId: {
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
        unlockTime: {
          type: Sequelize.BIGINT,
          allowNull: true,
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

    await queryInterface.addIndex({ tableName: 'IdentityNftBalanceLock', schema: db.schema }, ['unlockTime'], {
      indexName: 'unlockTime',
    });
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'IdentityNftBalanceLock', schema: db.schema }),
};

const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'TransactionHistoryType', schema: db.schema },
      {
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'TransactionHistoryType', schema: db.schema }),
};

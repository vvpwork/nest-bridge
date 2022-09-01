const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'AccountType', schema: db.schema },
      {
        code: {
          type: Sequelize.STRING(16),
          allowNull: false,
          primaryKey: true,
        },
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'AccountType', schema: db.schema }),
};

const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'NotificationType', schema: db.schema },
      {
        code: {
          type: Sequelize.STRING(64),
          allowNull: false,
          primaryKey: true,
        },
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'NotificationType', schema: db.schema }),
};

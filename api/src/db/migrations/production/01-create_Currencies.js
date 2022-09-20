const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Currencies', schema: db.schema },
      {
        symbol: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        address: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        decimals: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Currencies', schema: db.schema }),
};

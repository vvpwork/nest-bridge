const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Blockchain', schema: db.schema },
      {
        chainId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Blockchain', schema: db.schema }),
};

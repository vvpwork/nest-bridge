const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TransactionHistory', 'amount', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: {},
};

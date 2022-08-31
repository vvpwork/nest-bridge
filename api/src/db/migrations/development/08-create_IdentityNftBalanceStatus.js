const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({ tableName: 'IdentityNftBalanceStatus', schema: db.schema }, {
      code: {
        type: Sequelize.STRING(16),
        allowNull: false,
        primaryKey: true,
      },
    });
// TODO: remove from here 
    await queryInterface.bulkInsert(
      'IdentityNftBalanceStatus',
      [
        {
          code: 'sold'
        },
      ]
    );
  },

  down: (queryInterface) => queryInterface.dropTable('IdentityNftBalanceStatus'),
};

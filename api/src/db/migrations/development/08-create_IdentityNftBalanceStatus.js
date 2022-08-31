module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IdentityNftBalanceStatus', {
      code: {
        type: Sequelize.STRING(16),
        allowNull: false,
        primaryKey: true,
      },
    });

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

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AccountType', {
      code: {
        type: Sequelize.STRING(16),
        allowNull: false,
        primaryKey: true,
      },
    });

    await queryInterface.bulkInsert(
      'AccountType',
      [ {
          code: 'user'
        },
        {
          code: 'partner'
        },
        {
          code: 'admin'
        },
      ]
    );
  },

  down: (queryInterface) => queryInterface.dropTable('AccountType'),
};

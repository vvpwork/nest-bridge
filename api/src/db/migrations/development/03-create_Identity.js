module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Identity', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      securitizeId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accountType: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'AccountType',
          key: 'code',
        },
      },
      profileId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Profile',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      nonce: {
        type: Sequelize.BIGINT,
        allowNull: false,
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
    });
  },

  down: (queryInterface) => queryInterface.dropTable('Identity'),
};

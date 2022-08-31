module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IdentityNftBalance', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      identityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Identity',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      nftId: {
        type: Sequelize.STRING(60),
        allowNull: false,
        references: {
          model: 'Nft',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(16),
        allowNull: true,
        references: {
          model: 'IdentityNftBalanceStatus',
          key: 'code',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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

  down: (queryInterface) => queryInterface.dropTable('IdentityNftBalance'),
};

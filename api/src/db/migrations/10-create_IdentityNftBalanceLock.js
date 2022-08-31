module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IdentityNftBalanceLock', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      identityNftBalanceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'IdentityNftBalance',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unlockTime:{
        type: Sequelize.BIGINT,
        allowNull: true,
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

    await queryInterface.addIndex('IdentityNftBalanceLock', ['unlockTime'], {
      indexName: 'unlockTime',
    });
  },

  down: (queryInterface) => queryInterface.dropTable('IdentityNftBalanceLock'),
};

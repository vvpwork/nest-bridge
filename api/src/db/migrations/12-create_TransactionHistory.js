module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionHistory', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      identityId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Identity',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      nftId: {
        type: Sequelize.STRING(60),
        allowNull: true,
        references: {
          model: 'Nft',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      txHash: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'TransactionHistoryType',
          key: 'code',
        },
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

  down: (queryInterface) => queryInterface.dropTable('TransactionHistory'),
};

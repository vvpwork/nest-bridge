module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Nft', {
      id: {
        type: Sequelize.STRING(60),
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
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      chainId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Blockchain',
          key: 'chainId',
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

  down: (queryInterface) => queryInterface.dropTable('Nft'),
};

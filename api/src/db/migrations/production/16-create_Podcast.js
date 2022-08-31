module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Podcast', {
      id: {
        type: Sequelize.STRING(60),
        allowNull: false,
        primaryKey: true,
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
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
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
  },

  down: (queryInterface) => queryInterface.dropTable('Podcast'),
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NewsLike', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      profileId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Profile',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      newsId: {
        type: Sequelize.STRING(60),
        allowNull: false,
        references: {
          model: 'News',
          key: 'id',
        },
        onDelete: 'CASCADE',
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

    queryInterface.addConstraint('NewsLike', {
      fields: ['identityId', 'newsId'],
      type: 'unique',
      name: 'constraint_identityId_newsId',
    });
  },

  down: (queryInterface) => queryInterface.dropTable('NewsLike'),
};

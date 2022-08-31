module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Follower', {
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
        onUpdate: 'CASCADE',
      },
      targetProfileId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Profile',
          key: 'id',
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

    queryInterface.addConstraint('Follower', {
      fields: ['profileId', 'targetProfileId'],
      type: 'unique',
      name: 'constraint_profileId_targetProfileId',
    });
  },

  down: (queryInterface) => queryInterface.dropTable('Follower'),
};

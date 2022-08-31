module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Profile', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      cover: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      socials: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      sections: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      email:{
        type: Sequelize.STRING,
        after: 'identityId',
        allowNull: true,
    },
      communityLink: {
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

    await queryInterface.addIndex('Profile', ['userName'], {
      indexName: 'userName',
    });
  },

  down: (queryInterface) => queryInterface.dropTable('Profile'),
};

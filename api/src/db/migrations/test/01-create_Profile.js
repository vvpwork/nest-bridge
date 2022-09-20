const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Profile', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
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
          type: Sequelize.JSON,
          allowNull: true,
        },
        sections: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
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
      },
    );

    // await queryInterface.addIndex({ tableName: 'Profile', schema: db.schema }, ['userName'], {
    //   indexName: 'userName',
    // });
    // await queryInterface.addIndex({ tableName: 'Profile', schema: db.schema }, ['id'], {
    //   indexName: 'id',
    // });
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Profile', schema: db.schema }),
};

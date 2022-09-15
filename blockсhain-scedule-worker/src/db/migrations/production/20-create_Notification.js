const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Notification ', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        profileId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Profile',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        type: {
          type: Sequelize.STRING(64),
          allowNull: false,
          references: {
            model: 'NotificationType',
            key: 'code',
          },
        },
        isRead: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        params: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {},
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

    await queryInterface.addIndex({ tableName: 'Notification ', schema: db.schema }, ['profileId', 'isRead'], {
      indexName: 'profileId_isRead',
    });
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Notification ', schema: db.schema }),
};

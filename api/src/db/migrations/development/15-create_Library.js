const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Library ', schema: db.schema },
      {
        id: {
          type: Sequelize.STRING(60),
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
        title: {
          type: Sequelize.STRING,
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
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Library ', schema: db.schema }),
};

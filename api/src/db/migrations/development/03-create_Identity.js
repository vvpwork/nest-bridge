const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Identity', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },

        status: {
          type: Sequelize.ENUM('in_progress', 'verified', 'contact_support', 'updates_required'),
          allowNull: false,
          defaultValue: 'in_progress',
        },

        securitizeId: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        accountType: {
          type: Sequelize.ENUM('user', 'partner'),
          allowNull: false,
          references: {
            model: 'AccountType',
            key: 'code',
          },
        },

        profileId: {
          type: Sequelize.BIGINT,
          unique: true,
          allowNull: false,
          references: {
            model: 'Profile',
            key: 'id'
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
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Identity', schema: db.schema }),
};

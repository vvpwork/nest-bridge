const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Identity', schema: db.schema },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        securitizeId: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: true,
        },

        status: {
          type: Sequelize.ENUM('in_progress', 'verified', 'contact_support', 'updates_required'),
          allowNull: false,
          defaultValue: 'in_progress',
        },

        accountType: {
          type: Sequelize.ENUM('user', 'partner'),
          allowNull: false,
          defaultValue: 'user',
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
            key: 'id',
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

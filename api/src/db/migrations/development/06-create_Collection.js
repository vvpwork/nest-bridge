const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Collection', schema: db.schema },
      {
        id: {
          type: Sequelize.STRING,
          defaultValue: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },

        identityId: {
          type: Sequelize.BIGINT,
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

        symbol: {
          type: Sequelize.STRING,
        },

        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        masterAddress: {
          type: Sequelize.STRING,
        },

        salt: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },

        cover: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        logo: {
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
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Collection', schema: db.schema }),
};

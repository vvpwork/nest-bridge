const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({ tableName: 'Identity', schema: db.schema }, {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      securitizeId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accountType: {
        type: Sequelize.STRING(16),
        allowNull: false,
        references: {
          model: 'AccountType',
          key: 'code',
        },
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
      nonce: {
        type: Sequelize.BIGINT,
        allowNull: false,
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

    await queryInterface.addConstraint(
        { tableName: 'Identity' },
        {
          type: 'UNIQUE',
          fields: ['address'],
          name: 'unique_address',
        },
    );
  },

  down: (queryInterface) => queryInterface.dropTable('Identity'),
};

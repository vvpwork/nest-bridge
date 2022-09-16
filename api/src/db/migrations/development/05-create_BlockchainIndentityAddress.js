const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'BlockchainIdentityAddress', schema: db.schema },
      {
        id: {
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.BIGINT,
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

        IdentityId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Identity',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },

        address: {
          unique: true,
          type: Sequelize.STRING,
          allowNull: false,
        },

        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
    );

    await queryInterface.addConstraint(
      { tableName: 'BlockchainIdentityAddress', schema: db.schema },
      {
        type: 'UNIQUE',
        fields: ['IdentityId', 'chainId', 'address'],
        name: 'unique_identityChainAddress',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'BlockchainIdentityBalance', schema: db.schema }),
};

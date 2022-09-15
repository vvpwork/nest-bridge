const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'IdentityNftCreator', schema: db.schema },
      {
        identityId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Identity',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        address: {
          type:Sequelize.STRING,
          allowNull: false,
        },
        nftId: {
          type: Sequelize.STRING,
          references: {
            model: 'Nft',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        amount: {
          type: Sequelize.INTEGER,
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
      },
    );

    await queryInterface.addConstraint(
      { tableName: 'IdentityNftCreator', schema: db.schema },
      {
        type: 'UNIQUE',
        fields: ['identityId', 'nftId'],
        name: 'unique_identityNftCreator',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'IdentityNftBalance', schema: db.schema }),
};

const nodeConfig = require('config');
const db = nodeConfig.get('db');



module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'Follower', schema: db.schema },
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
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
        targetProfileId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Profile',
            key: 'id',
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

    queryInterface.addConstraint(
      { tableName: 'Follower', schema: db.schema },
      {
        fields: ['profileId', 'targetProfileId'],
        type: 'unique',
        name: 'constraint_profileId_targetProfileId',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'Follower', schema: db.schema }),
};

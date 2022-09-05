const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { tableName: 'NewsLike', schema: db.schema },
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
        },
        newsId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'News',
            key: 'id',
          },
          onDelete: 'CASCADE',
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
      { tableName: 'NewsLike', schema: db.schema },
      {
        fields: ['profileId', 'newsId'],
        type: 'unique',
        name: 'constraint_identityId_newsId',
      },
    );
  },

  down: queryInterface => queryInterface.dropTable({ tableName: 'NewsLike', schema: db.schema }),
};

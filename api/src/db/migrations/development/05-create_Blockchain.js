const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({ tableName: 'Blockchain', schema: db.schema }, {
      chainId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
        description:{
            type: Sequelize.STRING,
            allowNull: true,
        }
    });

    // TODO remove from here 

    await queryInterface.bulkInsert(
      'Blockchain',
      [ {
          chainId: 1,
          name:'Ethereum',
          description: 'Ethereum Main Network (Mainnet)'
        },
          {
              chainId: 3,
              name:'Ropsten',
              description: 'Ethereum Ropsten Test Network'
          },
          {
              chainId: 4,
              name:'Rinkeby',
              description: 'Ethereum Rinkeby Test Network'
          },
          {
              chainId: 5,
              name:'Goerli',
              description: 'Ethereum Goerli Test Network'
          },
          {
              chainId: 42,
              name:'Kovan',
              description: 'Ethereum Kovan Test Network'
          },
          {
              chainId: 43114,
              name:'Avax',
              description: 'Avalanche C-Chain(mainnet)'
          },
          {
              chainId: 43113,
              name:'Fuji',
              description: 'Avalanche Fuji Testnet'
          },

      ]
    );
  },

  down: (queryInterface) => queryInterface.dropTable('Blockchain'),
};

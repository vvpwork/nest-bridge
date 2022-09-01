const nodeConfig = require('config');
const db = nodeConfig.get('db');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert({ tableName: 'Blockchain', schema: db.schema }, [
      {
        chainId: 1,
        name: 'Ethereum',
        description: 'Ethereum Main Network (Mainnet)',
      },
      {
        chainId: 3,
        name: 'Ropsten',
        description: 'Ethereum Ropsten Test Network',
      },
      {
        chainId: 4,
        name: 'Rinkeby',
        description: 'Ethereum Rinkeby Test Network',
      },
      {
        chainId: 5,
        name: 'Goerli',
        description: 'Ethereum Goerli Test Network',
      },
      {
        chainId: 42,
        name: 'Kovan',
        description: 'Ethereum Kovan Test Network',
      },
      {
        chainId: 43114,
        name: 'Avax',
        description: 'Avalanche C-Chain(mainnet)',
      },
      {
        chainId: 43113,
        name: 'Fuji',
        description: 'Avalanche Fuji Testnet',
      },
    ]);
  },

  down: queryInterface => queryInterface.bulkDelete({ tableName: 'Blockchain', schema: db.schema }, { where: {}, truncate: true }),
};

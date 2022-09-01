const { upsertData } = require('../../utils/helper');

module.exports = {
  up: async queryInterface => {
    const blockchains = [
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
    ];

    const blockchainsQuery = upsertData(
      'Blockchain',
      ['"chainId"', 'name', 'description'],
      blockchains.map(tr => [`'${tr.chainId}','${tr.name}','${tr.description}'`]),
      '"chainId"',
    );

    await queryInterface.sequelize.query(blockchainsQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('Blockchain'),
};

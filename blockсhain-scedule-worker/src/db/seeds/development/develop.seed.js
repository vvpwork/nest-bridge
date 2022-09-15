/* eslint-disable */
const { upsertData, resetSequence } = require('../../utils/helper');

module.exports = {
  up: async queryInterface => {
    const accountTypes = [
      {
        code: 'user',
      },
      {
        code: 'partner',
      },
    ];

    const accountTypeQuery = upsertData(
      'AccountType',
      ['code'],
      accountTypes.map(tr => [`'${tr.code}'`]),
    );

    await queryInterface.sequelize.query(accountTypeQuery);

    const profiles = [
      {
        id: 1,
        cover: 'https://test',
        avatar: 'https://test',
        name: 'testUser',
        userName: 'testUser1',
        sections: '[]',
        socials: '{}',
        email: 'test@email.com',
      },
      {
        id: 2,
        cover: 'https://test',
        avatar: 'https://test',
        name: 'userName2',
        userName: 'testUser2',
        sections: '[]',
        socials: '{}',
        email: 'test@email.com',
      },
    ];

    const profilesQuery = upsertData(
      'Profile',
      ['id', 'cover', 'avatar', 'name', 'userName', 'sections', 'socials', 'email'],
      profiles.map(tr => [
        `'${tr.id}','${tr.cover}','${tr.avatar}','${tr.name}', '${tr.userName}','${tr.sections}','${tr.socials}','${tr.email}'`,
      ]),
    );

    await queryInterface.sequelize.query(profilesQuery);
    // await resetSequence(queryInterface, 'Profile');

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
      ['chainId', 'name', 'description'],
      blockchains.map(tr => [`'${tr.chainId}','${tr.name}','${tr.description}'`]),
    );

    await queryInterface.sequelize.query(blockchainsQuery);

    const transactionHistoryTypes = [
      {
        code: 'buy',
      },
      {
        code: 'sell',
      },
      {
        code: 'mint',
      },
      {
        code: 'list',
      },
      {
        code: 'unList',
      },
      {
        code: 'priceUpdate',
      },
      {
        code: 'royaltyReceived',
      },
    ];

    const transactionHistoryTypesQuery = upsertData(
      'TransactionHistoryType',
      ['code'],
      transactionHistoryTypes.map(tr => [`'${tr.code}'`]),
    );

    await queryInterface.sequelize.query(transactionHistoryTypesQuery);

    const notificationTypes = [
      {
        code: 'nftSold',
      },
      {
        code: 'royaltyReceived',
      },
      {
        code: 'followingPersonListsNft',
      },
      {
        code: 'followingPersonAddedNews',
      },
      {
        code: 'followingPersonAddedPodcast',
      },
      {
        code: 'followingPersonAddedLibrary',
      },
      {
        code: 'nftsUnlocked',
      },
      {
        code: 'newFollower',
      },
    ];

    const notificationTypesQuery = upsertData(
      'NotificationType',
      ['code'],
      notificationTypes.map(tr => [`'${tr.code}'`]),
    );

    await queryInterface.sequelize.query(notificationTypesQuery);

    const balanceStatuses = [
      {
        code: 'sold',
      },
      {
        code: 'selling',
      },
    ];

    const balanceStatusesQuery = upsertData(
      'IdentityNftBalanceStatus',
      ['code'],
      balanceStatuses.map(tr => [`'${tr.code}'`]),
    );

    await queryInterface.sequelize.query(balanceStatusesQuery);

    const identities = [
      {
        id: '626b881ce1358f001420e238',
        status: 'verified',
        securitizeId: 'dfgdhfjg33333ukjthdrgsefa',
        accountType: 'user',
        status: 'in_progress',
        profileId: 1,
      },
      {
        id: '756b354ce1358f001420e238',
        status: 'verified',
        securitizeId: 'dfgdhfjg33333434r4343fa',
        accountType: 'user',
        status: 'in_progress',
        profileId: 2,
      },
    ];

    const identitiesQuery = upsertData(
      'Identity',
      ['id', 'securitizeId', 'status', 'accountType', 'profileId'],
      identities.map(tr => [`'${tr.id}','${tr.securitizeId}','${tr.status}','${tr.accountType}','${tr.profileId}'`]),
    );
    await queryInterface.sequelize.query(identitiesQuery);
    const bcIdentityAddress = [
      {
        id: 1,
        chainId: 43113,
        IdentityId: '626b881ce1358f001420e238',
        address: '0x3C865AC4Bd0B7652Aab04e94E1a14ED39c868879',
      },
      {
        id: 2,
        chainId: 43113,
        IdentityId: '756b354ce1358f001420e238',
        address: '0x0aFD4FCef8C90E822fadE0472d7f4b31496Cf2e8',
      },
    ];

    const bcIdentityQuery = upsertData(
      'BlockchainIdentityAddress',
      ['id', 'chainId', 'IdentityId', 'address'],
      bcIdentityAddress.map(tr => [`'${tr.id}','${tr.chainId}','${tr.IdentityId}', '${tr.address}'`]),
    );

    await queryInterface.sequelize.query(bcIdentityQuery);
    // await resetSequence(queryInterface, 'Identity');

    const currencies = [
      { name: 'USDC token', symbol: 'USDC', decimals: 6, address: '0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160' },
    ];
    const currenciesQuery = upsertData(
      'Currencies',
      ['name', 'symbol', 'decimals', 'address'],
      currencies.map(tr => [`'${tr.name}','${tr.symbol}','${tr.decimals}','${tr.address}'`]),
    );

    await queryInterface.sequelize.query(currenciesQuery);
    // await resetSequence(queryInterface, 'Currencies');

    const collections = [
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346467',
        identityId: '626b881ce1358f001420e238',
        description: 'BridgeTower Permissioned Market Token',
        name: 'BridgeTower Permissioned Market Token',
        cover: 'test',
        logo: 'test',
        symbol: 'PMT',
        salt: 3232,
        chainId: 43113,
        masterAddress: 'testAddress',
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346489',
        identityId: '756b354ce1358f001420e238',
        description: 'BridgeTower Permissioned Market Token Test',
        name: 'BridgeTower Permissioned Market Token Test',
        cover: 'test',
        logo: 'test',
        symbol: 'PMTtest1',
        salt: 3223,
        chainId: 43113,
        masterAddress: 'testAddress',
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        identityId: '756b354ce1358f001420e238',
        description: 'BridgeTower Permissioned Market Token Test2',
        name: 'BridgeTower Permissioned Market Token Test2',
        cover: 'test',
        logo: 'test',
        symbol: 'PMTTest2',
        salt: 3223,
        chainId: 43113,
        masterAddress: 'testAddress',
      },
    ];

    const collectionQuery = upsertData(
      'Collection',
      ['id', 'identityId', 'name', 'description', 'cover', 'logo', 'symbol', 'salt', 'chainId', 'masterAddress'],
      collections.map(tr => [
        `'${tr.id}','${tr.identityId}','${tr.name}','${tr.description}', '${tr.cover}', '${tr.logo}','${tr.symbol}',${tr.salt}, '${tr.chainId}', '${tr.masterAddress}'`,
      ]),
    );

    await queryInterface.sequelize.query(collectionQuery);

    const nfts = [
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_1',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346489',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 1000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_2',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346489',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_3',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_4',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_5',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_6',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_7',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
      {
        id: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_8',
        collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346400',
        thumbnail: 'test',
        amount: 1000,
        metadata: JSON.stringify({ name: 'test' }),
        creatorIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royaltyIds: JSON.stringify(['0x8dcF19AeE31F9624FCe35F61037c80f2CA3464creator']),
        royalty: 2000,
        totalSupply: 1000,
      },
    ];

    const nftsQuery = upsertData(
      'Nft',
      ['id', 'collectionId', 'thumbnail', 'amount', 'metadata', 'creatorIds', 'royaltyIds', 'royalty', 'totalSupply'],
      nfts.map(tr => [
        `'${tr.id}','${tr.collectionId}','${tr.thumbnail}','${tr.amount}', '${tr.metadata}', '${tr.creatorIds}','${tr.royaltyIds}',${tr.royalty}, '${tr.totalSupply}'`,
      ]),
    );

    await queryInterface.sequelize.query(nftsQuery);

    const balances = [
      {
        id: '0x8dcF19AeE31F9624F',
        identityId: '626b881ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_1',
        amount: 200,
      },
      {
        id: '0x8dcF19AeE31F96443',
        identityId: '626b881ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_1',
        amount: 200,
      },
      {
        id: '0x8dcF19AeE31F9dw3',
        identityId: '756b354ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_3',
        amount: 200,
      },
      {
        id: '0x8dcF19AeE31F9dw4',
        identityId: '756b354ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_4',
        amount: 200,
      },
      {
        id: '0x8dcF19AeE31F9dw5',
        identityId: '756b354ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_5',
        amount: 200,
      },
      {
        id: '0x8dcF19AeE31F9dw6',
        identityId: '756b354ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_6',
        amount: 200,
      },
      {
        id: '0x8dcF19AeE31F9dw7',
        identityId: '756b354ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_7',
        amount: 200,
      },
    ];
    const balancesQuery = upsertData(
      'IdentityNftBalance',
      ['id', 'identityId', 'nftId', 'amount'],
      balances.map(tr => [`'${tr.id}','${tr.identityId}','${tr.nftId}','${tr.amount}'`]),
    );

    await queryInterface.sequelize.query(balancesQuery);

    const orders = [
      {
        id: '0x8dcF19AeE31F9624F',
        nftIdentityBalanceId: '0x8dcF19AeE31F9624F',
        amount: 20,
        price: '10000000',
        currency: 'USDC',
        signature: JSON.stringify({ test: 'test' }),
        metadata: JSON.stringify({ test: 'test' }),
      },
      {
        id: '0x8dcF19AeE31F9dw3',
        nftIdentityBalanceId: '0x8dcF19AeE31F9dw3',
        amount: 10,
        price: '600000',
        currency: 'USDC',
        signature: JSON.stringify({ test: 'test' }),
        metadata: JSON.stringify({ test: 'test' }),
      },
    ];

    const ordersQuery = upsertData(
      'Orders',
      ['id', 'nftIdentityBalanceId', 'amount', 'price', 'currency', 'signature', 'metadata'],
      orders.map(tr => [
        `'${tr.id}','${tr.nftIdentityBalanceId}','${tr.amount}','${tr.price}', '${tr.currency}', '${tr.signature}', '${tr.metadata}'`,
      ]),
    );
    await queryInterface.sequelize.query(ordersQuery);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Currencies');
    await queryInterface.bulkDelete('Identity');
    await queryInterface.bulkDelete('Blockchain');
    await queryInterface.bulkDelete('TransactionHistoryType');
    await queryInterface.bulkDelete('NotificationType');
    await queryInterface.bulkDelete('IdentityNftBalanceStatus');
    await queryInterface.bulkDelete('AccountType');
    await queryInterface.bulkDelete('Profile');
    await queryInterface.bulkDelete('Collection');
    await queryInterface.bulkDelete('Nft');
    await queryInterface.bulkDelete('IdentityNftBalance');
  },
};

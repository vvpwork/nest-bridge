/* eslint-disable */
const { upsertData, resetSequence } = require('../../utils/helper');
const oldProfiles = require('./oldProfiles.json');
const oldIdentities = require('./oldIdentities.json');
const oldBcAddresses = require('./oldBcAddresses.json');

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
      ...oldProfiles,
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
        code: 'stake',
      },
      {
        code: 'claim',
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
      ...oldIdentities,
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
        identityId: '626b881ce1358f001420e238',
        address: '0x3C865AC4Bd0B7652Aab04e94E1a14ED39c868879',
      },
      {
        id: 2,
        chainId: 43113,
        identityId: '756b354ce1358f001420e238',
        address: '0x0aFD4FCef8C90E822fadE0472d7f4b31496Cf2e8',
      },
      ...oldBcAddresses,
    ];

    const bcIdentityQuery = upsertData(
      'BlockchainIdentityAddress',
      ['id', 'chainId', 'IdentityId', 'address'],
      bcIdentityAddress.map(tr => [`'${tr.id}','${tr.chainId}','${tr.identityId}', '${tr.address}'`]),
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

    // add creators
    const creatorsQuery = upsertData(
      'IdentityNftCreator',
      ['address', 'nftId'],
      nfts.map(cr => [`'0x3C865AC4Bd0B7652Aab04e94E1a14ED39c868879', '${cr.id}'`]),
    );

    await queryInterface.sequelize.query(creatorsQuery);

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

    const nftLikes = [
      {
        id: 1,
        profileId: 1,
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_1',
      },
      {
        id: 2,
        profileId: 2,
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_2',
      },
      {
        id: 3,
        profileId: 1,
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_3',
      },
      {
        id: 4,
        profileId: 2,
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_4',
      },
    ];
    const nftLikesQuery = upsertData(
      'NftLike',
      ['id', 'profileId', 'nftId'],
      nftLikes.map(m => [`'${m.id}', '${m.profileId}', '${m.nftId}'`]),
    );
    await queryInterface.sequelize.query(nftLikesQuery);

    const followers = [
      {
        id: 1,
        profileId: 1,
        targetProfileId: 2,
      },
      {
        id: 2,
        profileId: 2,
        targetProfileId: 1,
      },
    ];
    const followersQuery = upsertData(
      'Follower',
      ['id', 'profileId', 'targetProfileId'],
      followers.map(m => [`'${m.id}', '${m.profileId}', '${m.targetProfileId}'`]),
    );
    await queryInterface.sequelize.query(followersQuery);

    const library = [
      {
        id: 'ec53ed9e-707b-450e-b35a-b780825b3ffd',
        profileId: 1,
        title: 'Lib 1',
        image: 'https://via.placeholder.com/150x100',
        source: 'src1',
      },
      {
        id: '4fd5be7d-72df-40ea-be94-e0ed6f5e7c94',
        profileId: 1,
        title: 'Lib 2',
        image: 'https://via.placeholder.com/150',
        source: 'src2',
      },
      {
        id: '955a7b8a-b138-4338-93ca-a462ce0320e3',
        profileId: 2,
        title: 'Lib 3',
        image: 'https://via.placeholder.com/200',
        source: 'src3',
      },
      {
        id: 'b5ceb930-93b2-4cee-9d85-d95e6527bbfe',
        profileId: 2,
        title: 'Lib 4',
        image: 'https://via.placeholder.com/250',
        source: 'src4',
      },
      {
        id: '4a6d20df-5efa-430c-b68e-395e470bfe75',
        profileId: 1,
        title: 'Lib 5',
        image: 'https://via.placeholder.com/100',
        source: 'src5',
      },
    ];
    const libraryQuery = upsertData(
      'Library',
      ['id', 'profileId', 'title', 'image', 'source'],
      library.map(m => [`'${m.id}','${m.profileId}','${m.title}','${m.image}','${m.source}'`]),
    );
    await queryInterface.sequelize.query(libraryQuery);

    const news = [
      {
        id: 'ee4e4c23-f306-48e4-8ee6-92e3b75134e5',
        profileId: 1,
        title: 'News1',
        description: 'Description for news 1',
        image: 'https://via.placeholder.com/201',
        source: 'Source for news 1',
      },
      {
        id: '892d2ea7-d207-49d9-9a9b-43b8a0be5441',
        profileId: 2,
        title: 'News2',
        description: 'Description for news 2',
        image: 'https://via.placeholder.com/202',
        source: 'Source for news 2',
      },
      {
        id: 'e801c66c-0caa-48e7-a961-d60448c15f94',
        profileId: 1,
        title: 'News3',
        description: 'Description for news 3',
        image: 'https://via.placeholder.com/203',
        source: 'Source for news 3',
      },
      {
        id: '31ab799e-bad4-473b-8059-c1eabe8ab50d',
        profileId: 2,
        title: 'News4',
        description: 'Description for news 4',
        image: 'https://via.placeholder.com/204',
        source: 'Source for news 4',
      },
      {
        id: '7f98dd9f-7c1f-4bf8-8244-704334074ee9',
        profileId: 1,
        title: 'News5',
        description: 'Description for news 5',
        image: 'https://via.placeholder.com/205',
        source: 'Source for news 5',
      },
    ];
    const newsQuery = upsertData(
      'News',
      ['id', 'profileId', 'title', 'description', 'image', 'source'],
      news.map(m => [`'${m.id}','${m.profileId}','${m.title}','${m.description}','${m.image}','${m.source}'`]),
    );
    await queryInterface.sequelize.query(newsQuery);

    const newsLike = [
      {
        id: 1,
        profileId: 1,
        newsId: '892d2ea7-d207-49d9-9a9b-43b8a0be5441',
      },
      {
        id: 2,
        profileId: 1,
        newsId: '31ab799e-bad4-473b-8059-c1eabe8ab50d',
      },
      {
        id: 3,
        profileId: 2,
        newsId: '7f98dd9f-7c1f-4bf8-8244-704334074ee9',
      },
      {
        id: 4,
        profileId: 2,
        newsId: 'ee4e4c23-f306-48e4-8ee6-92e3b75134e5',
      },
      {
        id: 5,
        profileId: 1,
        newsId: 'ee4e4c23-f306-48e4-8ee6-92e3b75134e5',
      },
    ];
    const newsLikeQuery = upsertData(
      'NewsLike',
      ['id', 'profileId', 'newsId'],
      newsLike.map(m => [`'${m.id}','${m.profileId}','${m.newsId}'`]),
    );
    await queryInterface.sequelize.query(newsLikeQuery);

    const notifications = [
      {
        id: 1,
        profileId: 1,
        type: 'newFollower',
        isRead: 0,
        params: JSON.stringify({ id: 2 }),
      },
      {
        id: 2,
        profileId: 2,
        type: 'newFollower',
        isRead: 1,
        params: JSON.stringify({ id: 1 }),
      },
    ];
    const notificationsQuery = upsertData(
      'Notification',
      ['id', 'profileId', 'type', 'isRead', 'params'],
      notifications.map(m => [`'${m.id}','${m.profileId}','${m.type}','${m.isRead}','${m.params}'`]),
    );
    // await queryInterface.sequelize.query(notificationsQuery);

    const podcasts = [
      {
        id: '19643c2b-812d-4644-9497-4e7f31a7294d',
        profileId: 1,
        title: 'podcast1',
        description: 'Description for podcast 1',
        image: 'https://via.placeholder.com/301',
        source: 'Source for podcast 1',
      },
      {
        id: '03786300-7153-469c-a0ab-e614974ba3e7',
        profileId: 1,
        title: 'podcast2',
        description: 'Description for podcast 2',
        image: 'https://via.placeholder.com/302',
        source: 'Source for podcast 2',
      },
      {
        id: '833949e9-6ea7-4a73-8e60-02ff8948b6b6',
        profileId: 2,
        title: 'podcast3',
        description: 'Description for podcast 3',
        image: 'https://via.placeholder.com/303',
        source: 'Source for podcast 3',
      },
      {
        id: '48d3cae6-d7d4-4741-8c0c-c6f4ab0cd266',
        profileId: 2,
        title: 'podcast4',
        description: 'Description for podcast 4',
        image: 'https://via.placeholder.com/304',
        source: 'Source for podcast 4',
      },
    ];
    const podcastsQuery = upsertData(
      'Podcast',
      ['id', 'profileId', 'title', 'description', 'image', 'source'],
      podcasts.map(m => [`'${m.id}','${m.profileId}','${m.title}','${m.description}','${m.image}','${m.source}'`]),
    );
    await queryInterface.sequelize.query(podcastsQuery);

    const transactionHistory = [
      {
        id: 1,
        identityId: '626b881ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_1',
        amount: 1,
        price: '10000000',
        txHash: '0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838',
        type: 'mint',
      },
      {
        id: 2,
        identityId: '756b354ce1358f001420e238',
        nftId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA3464nft_2',
        amount: 1,
        price: '200000000',
        txHash: '0x57cebd0d3af5e484d843e75cf018b5a7577cc313853c50feed406a166af9021f',
        type: 'buy',
      },
    ];
    const transactionHistoryQuery = upsertData(
      'TransactionHistory',
      ['id', 'identityId', 'nftId', 'amount', 'price', 'txHash', 'type'],
      transactionHistory.map(m => [
        `'${m.id}','${m.identityId}', '${m.nftId}', '${m.amount}', '${m.price}', '${m.txHash}', '${m.type}'`,
      ]),
    );
    await queryInterface.sequelize.query(transactionHistoryQuery);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('TransactionHistory');
    await queryInterface.bulkDelete('Podcast');
    await queryInterface.bulkDelete('Notification');
    await queryInterface.bulkDelete('NewsLike');
    await queryInterface.bulkDelete('News');
    await queryInterface.bulkDelete('Library');
    await queryInterface.bulkDelete('Follower');
    await queryInterface.bulkDelete('NftLike');
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

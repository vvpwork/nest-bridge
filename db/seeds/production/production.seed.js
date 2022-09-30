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

    const profiles = [...oldProfiles];

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

    const identities = [...oldIdentities];

    const identitiesQuery = upsertData(
      'Identity',
      ['id', 'securitizeId', 'status', 'accountType', 'profileId'],
      identities.map(tr => [`'${tr.id}','${tr.securitizeId}','${tr.status}','${tr.accountType}','${tr.profileId}'`]),
    );
    await queryInterface.sequelize.query(identitiesQuery);

    const bcIdentityAddress = [...oldBcAddresses];

    const bcIdentityQuery = upsertData(
      'BlockchainIdentityAddress',
      ['id', 'chainId', 'IdentityId', 'address'],
      bcIdentityAddress.map(tr => [`'${tr.id}','${tr.chainId}','${tr.identityId}', '${tr.address}'`]),
    );

    await queryInterface.sequelize.query(bcIdentityQuery);

    const currencies = [
      { name: 'USDC token', symbol: 'USDC', decimals: 6, address: '0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160' },
    ];
    const currenciesQuery = upsertData(
      'Currencies',
      ['name', 'symbol', 'decimals', 'address'],
      currencies.map(tr => [`'${tr.name}','${tr.symbol}','${tr.decimals}','${tr.address}'`]),
    );

    await queryInterface.sequelize.query(currenciesQuery);

    const collections = [];

    const collectionQuery = upsertData(
      'Collection',
      ['id', 'identityId', 'name', 'description', 'cover', 'logo', 'symbol', 'salt', 'chainId', 'masterAddress'],
      collections.map(tr => [
        `'${tr.id}','${tr.identityId}','${tr.name}','${tr.description}', '${tr.cover}', '${tr.logo}','${tr.symbol}',${tr.salt}, '${tr.chainId}', '${tr.masterAddress}'`,
      ]),
    );

    // await queryInterface.sequelize.query(collectionQuery);

    const nfts = [];

    const nftsQuery = upsertData(
      'Nft',
      ['id', 'collectionId', 'thumbnail', 'amount', 'metadata', 'creatorIds', 'royaltyIds', 'royalty', 'totalSupply'],
      nfts.map(tr => [
        `'${tr.id}','${tr.collectionId}','${tr.thumbnail}','${tr.amount}', '${tr.metadata}', '${tr.creatorIds}','${tr.royaltyIds}',${tr.royalty}, '${tr.totalSupply}'`,
      ]),
    );

    // await queryInterface.sequelize.query(nftsQuery);

    // add creators
    const creatorsQuery = upsertData(
      'IdentityNftCreator',
      ['address', 'nftId'],
      nfts.map(cr => [`'0x3C865AC4Bd0B7652Aab04e94E1a14ED39c868879', '${cr.id}'`]),
    );

    // await queryInterface.sequelize.query(creatorsQuery);

    const balances = [];
    const balancesQuery = upsertData(
      'IdentityNftBalance',
      ['id', 'identityId', 'nftId', 'amount'],
      balances.map(tr => [`'${tr.id}','${tr.identityId}','${tr.nftId}','${tr.amount}'`]),
    );

    // await queryInterface.sequelize.query(balancesQuery);

    const orders = [];

    const ordersQuery = upsertData(
      'Orders',
      ['id', 'nftIdentityBalanceId', 'amount', 'price', 'currency', 'signature', 'metadata'],
      orders.map(tr => [
        `'${tr.id}','${tr.nftIdentityBalanceId}','${tr.amount}','${tr.price}', '${tr.currency}', '${tr.signature}', '${tr.metadata}'`,
      ]),
    );
    // await queryInterface.sequelize.query(ordersQuery);

    const nftLikes = [];
    const nftLikesQuery = upsertData(
      'NftLike',
      ['id', 'profileId', 'nftId'],
      nftLikes.map(m => [`'${m.id}', '${m.profileId}', '${m.nftId}'`]),
    );
    // await queryInterface.sequelize.query(nftLikesQuery);

    const followers = [];
    const followersQuery = upsertData(
      'Follower',
      ['id', 'profileId', 'targetProfileId'],
      followers.map(m => [`'${m.id}', '${m.profileId}', '${m.targetProfileId}'`]),
    );
    // await queryInterface.sequelize.query(followersQuery);

    const library = [];
    const libraryQuery = upsertData(
      'Library',
      ['id', 'profileId', 'title', 'image', 'source'],
      library.map(m => [`'${m.id}','${m.profileId}','${m.title}','${m.image}','${m.source}'`]),
    );
    // await queryInterface.sequelize.query(libraryQuery);

    const news = [];
    const newsQuery = upsertData(
      'News',
      ['id', 'profileId', 'title', 'description', 'image', 'source'],
      news.map(m => [`'${m.id}','${m.profileId}','${m.title}','${m.description}','${m.image}','${m.source}'`]),
    );
    // await queryInterface.sequelize.query(newsQuery);

    const newsLike = [];
    const newsLikeQuery = upsertData(
      'NewsLike',
      ['id', 'profileId', 'newsId'],
      newsLike.map(m => [`'${m.id}','${m.profileId}','${m.newsId}'`]),
    );
    // await queryInterface.sequelize.query(newsLikeQuery);

    const notifications = [];
    const notificationsQuery = upsertData(
      'Notification',
      ['id', 'profileId', 'type', 'isRead', 'params'],
      notifications.map(m => [`'${m.id}','${m.profileId}','${m.type}','${m.isRead}','${m.params}'`]),
    );
    // await queryInterface.sequelize.query(notificationsQuery);

    const podcasts = [];
    const podcastsQuery = upsertData(
      'Podcast',
      ['id', 'profileId', 'title', 'description', 'image', 'source'],
      podcasts.map(m => [`'${m.id}','${m.profileId}','${m.title}','${m.description}','${m.image}','${m.source}'`]),
    );
    // await queryInterface.sequelize.query(podcastsQuery);

    const transactionHistory = [];
    const transactionHistoryQuery = upsertData(
      'TransactionHistory',
      ['id', 'identityId', 'nftId', 'amount', 'price', 'txHash', 'type'],
      transactionHistory.map(m => [
        `'${m.id}','${m.identityId}', '${m.nftId}', '${m.amount}', '${m.price}', '${m.txHash}', '${m.type}'`,
      ]),
    );
    // await queryInterface.sequelize.query(transactionHistoryQuery);
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

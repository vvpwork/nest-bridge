const { upsertData } = require('../../utils/helper');

module.exports = {
  up: async queryInterface => {
    const profiles = [
      {
        id: 1,
        cover: 'fdsfsdf',
        avatar: 'vataraaa',
        name: 'userName1',
        userName: 'testUser1',
        sections: '[]',
        socials: '{}',
        email: 'test@email.com',
      },
      {
        id: 2,
        cover: 'fdsfsdf',
        avatar: 'vataraaa',
        name: 'userName2',
        userName: 'testUser2',
        sections: '[]',
        socials: '{}',
        email: 'test@email.com',
      },
      {
        id: 3,
        cover: 'fdsfsdf',
        avatar: 'vataraaa',
        name: 'userName3',
        userName: 'testUser3',
        sections: '[]',
        socials: '{}',
        email: 'test@email.com',
      },
    ];

    const profilesQuery = upsertData(
      'Profile',
      ['id', 'cover', 'avatar', 'name', '"userName"', 'sections', 'socials', 'email'],
      profiles.map(tr => [
        `'${tr.id}','${tr.cover}','${tr.avatar}','${tr.name}', '${tr.userName}','${tr.sections}','${tr.socials}','${tr.email}'`,
      ]),
      'id',
    );

    await queryInterface.sequelize.query(profilesQuery);
  },

  down: queryInterface => queryInterface.bulkDelete('Profile'),
};

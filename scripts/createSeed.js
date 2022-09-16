/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/typedef */
const profile = require('./Profile_202209161026.json');
const identity = require('./_Identity__202209161026.json');
const fs = require('fs');

const profiles = [];
const identities = [];
const bcAddresses = [];
const data = profile.map((prof, i) => {
  const { identityId, ...resProf } = prof;
  const { address, ...resIdent } = identity.find(id => prof.identityId === id.id);

  if (prof.avatar) {
    profiles.push({
      ...resProf,
      id: i + 5,
    });

    identities.push({
      ...resIdent,
      profileId: i + 5,
      status: 'in_progress',
    });

    bcAddresses.push({
      id: i + 5,
      identityId: resIdent.id,
      address,
      chainId: 43113,
    });
  }

  return {
    profile: {
      ...resProf,
      id: i + 5,
    },
    identity: {
      ...resIdent,
      profileId: i + 5,
      status: 'in_progress',
    },

    blockchainAddress: {
      id: i + 5,
      identityId: resIdent.id,
      address,
      chainId: 43113,
    },
  };
});

fs.writeFileSync('oldProfiles.json', JSON.stringify(profiles));
fs.writeFileSync('oldIdentities.json', JSON.stringify(identities));
fs.writeFileSync('oldBcAddresses.json', JSON.stringify(bcAddresses));

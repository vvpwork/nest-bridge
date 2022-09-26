import { ICollectionQueryDto } from '../dtos';

export const getAllCollectionSelect = (query: ICollectionQueryDto) => `
    with temptable as (
    SELECT c.* , JSON_OBJECT(
      'id',  d.id,
      'name', d.name,
      'userName', d.userName,
      'address', d.address,
      'email', d.email,
      'status', d.status,
      'accountType', d.accountType,
      'cover', d.cover,
      'avatar', d.avatar
      ) as identity FROM Collection c
    LEFT JOIN (
      SELECT i.*, b.address, b.chainId, p.name, p.cover, p.avatar, p.email, p.userName FROM Identity i
      LEFT JOIN BlockchainIdentityAddress b ON  b.identityId = i.id
      LEFT JOIN Profile p ON  p.id = i.profileId
      GROUP BY i.id
    ) d ON c.identityId = d.id && c.chainId = d.chainId
    ${query.search ? `WHERE c.name LIKE '%${query.search}%'` : ''}
    ${query.collectionId ? `WHERE c.id = '${query.collectionId}'` : ''}
    ${query.identityId ? `WHERE c.identityId = '${query.identityId}'` : ``}
    GROUP BY c.id)

    SELECT tb.*, p.count  FROM temptable tb 
    JOIN (select count(t.id) as count from temptable t) p  
    ${query.limit ? `LIMIT ${query.limit}` : ''}
    ${query.offset ? `OFFSET ${query.offset}` : ''}
    `;

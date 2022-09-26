import { INftQueryDto } from '../dtos';

export const getNftSelect = (searchData: INftQueryDto, profileId: number) => {
  const {
    limit,
    offset,
    identityId,
    creatorId,
    collectionId,
    status,
    sortType,
    sortValue,
    nftId,
    search,
  } = searchData;

  return `
  WITH temptable as (
    SELECT
    b.identityId as identityId,
    ident.status as status,
    ident.accountType,
    JSON_OBJECT('id', pr.id, 'cover', pr.cover, 'avatar', pr.avatar, 'name', pr.name ) as profile,
    n.id as nftId, 
    JSON_OBJECT(
        'id', c.id, 
        'name', c.name, 
        'description', c.description,
        'logo', c.logo, 
        'cover', c.cover,
        'symbol', c.symbol
        ) as collection,
    n.royalty,
    n.metadata,
    n.amount  as totalNftAmount,
    n.thumbnail,
    cr.creatorsData,
    addr.address  as address,
    n.totalSupply, 
    n.creatorIds as creators,
    b.amount as identityBalance,
    l.lockedData,
    l.lockedBalance,
    IF(lik.count, lik.count, 0) as likesCount,
    IF(ll.id, 1, 0) as isLiked,
    IFNULL(sum(o.amount), 0) as onSale,
    IF ( sum(o.amount) is NULL, NULL, JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', o.id,
        'amount', o.amount, 
        'price', o.price,
        'signature', o.signature,
        'decimals', cur.decimals,
        'currency', cur.symbol, 
        'createdAt', o.createdAt
        ))) as onSalesData
    from Nft n

    JOIN Collection c ON c.id = n.collectionId 

    ${collectionId ? `&& c.id = '${collectionId}'` : ''}

    JOIN IdentityNftBalance b ON b.nftId = n.id && c.identityId = b.identityId 
    ${status === 'sold' ? `&&  b.status = 'sold'` : ''}   
    ${status === 'onSale' ? `JOIN` : `LEFT JOIN`} \`Orders\` o ON o.nftIdentityBalanceId = b.id
    LEFT JOIN Identity  ident ON ident.id = b.identityId  ${
      identityId ? `&&  ident.id = '${identityId}'` : ''
    }  
    LEFT JOIN Profile  pr ON pr.id = ident.profileId
    LEFT JOIN BlockchainIdentityAddress addr ON c.identityId = addr.identityId && c.chainId = addr.chainId    
    
    LEFT JOIN (
    SELECT li.nftId, count(li.id) as count 
    FROM NftLike li 
    GROUP BY li.nftId
    ) lik ON lik.nftId = n.id

    LEFT JOIN NftLike ll On ll.nftId = n.id && ll.profileId='${profileId}'


    ${creatorId ? `JOIN` : `LEFT JOIN`} (
      SELECT creator.address, id.id as identityId, bal.status, creator.nftId, JSON_ARRAYAGG(
        JSON_OBJECT(
          'address', creator.address,
          'identityId', id.id,
          'accountType', id.accountType,
          'name', pr.name,
          'userName', pr.userName,
          'avatar', pr.avatar
        )
      ) as creatorsData
      FROM IdentityNftCreator creator
      JOIN BlockchainIdentityAddress bad On bad.address = creator.address
      JOIN Identity id On id.id = bad.identityId
      JOIN IdentityNftBalance bal On bal.identityId = bad.identityId && bal.nftId = creator.nftId
      JOIN Profile pr On pr.id = id.profileId
      GROUP BY creator.nftId, creator.address
    ) cr ON cr.nftId = n.id 
    ${creatorId ? `&&  cr.identityId = '${creatorId}'` : ``}
    

    ${status === 'onLocked' ? `JOIN` : `LEFT JOIN`} (
      SELECT lk.identityNftBalanceId,
              sum(lk.amount) as lockedBalance, 
      JSON_ARRAYAGG(JSON_OBJECT('id', lk.id, 'amount', lk.amount, 'unlockTime', lk.unlockTime )) as lockedData  
      FROM IdentityNftBalanceLock lk
      GROUP BY lk.identityNftBalanceId
      ) l ON b.id = l.identityNftBalanceId
    LEFT JOIN Currencies cur ON o.currency = cur.symbol



    ${nftId ? `WHERE n.id = '${nftId}'` : ``}
    ${search ? `WHERE JSON_VALUE(n.metadata, '$.name') like '%${search}%'` : ``}
    ${status === 'sold' ? `WHERE b.identityId = cr.identityId ` : ``}   
    GROUP BY b.id
    ${sortValue === 'price' ? `ORDER BY  CONVERT(o.price, INTEGER) ${sortType}` : ``}
    ${sortValue === 'unlockTime' ? `ORDER BY l.unlockTime  ${sortType}` : ``}
    )


    SELECT
    tb.nftId as id, 
    p.count as count,
    tb.royalty,
    tb.metadata,
    tb.totalNftAmount,
    tb.thumbnail,
    tb.totalSupply,       
    tb.collection,
    tb.creatorsData,
    tb.likesCount,
    tb.isLiked,

    JSON_ARRAYAGG(
     JSON_OBJECT(
        'identityId', tb.identityId,
        'address', tb.address,
        'status', tb.status,
        'accountType', tb.accountType,
        'identityBalance', tb.identityBalance,
        'profile',tb.profile,
        'lockedData', tb.lockedData,
        'lockedBalance', tb.lockedBalance,
        'onSale', tb.onSale,
        'onSalesData', tb.onSalesData 
      )
    ) as owners
    FROM temptable tb
    JOIN (select count(t.nftId) as count from temptable t) p
    GROUP BY tb.nftId
    ${limit ? `LIMIT ${limit}` : ''}
    ${offset ? `OFFSET ${offset}` : ''}
    `;
};

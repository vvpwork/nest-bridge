import { HISTORY_TYPES } from '@DB/enums';

export const getPnlHistorySelect = (identityId: string, type: HISTORY_TYPES) => {
  const select = `
  with Staketable as (
    SELECT DATE(trs.createdAt) as date,
    trs.additionalInfo,  
    JSON_ARRAYAGG(
        trs.data
    ) as stakedData
    FROM TransactionHistory trs
    WHERE trs.identityId = '${identityId}' && type = 'stake'
    GROUP BY DAY(trs.createdAt))

    SELECT 
    DATE(tr.createdAt) as date,
    JSON_ARRAYAGG(
      tr.additionalInfo
  ) as balances,
    CONVERT(sum(tr.amount * CONVERT(tr.price, INTEGER)), CHAR)  as totalNfts,
    st.stakedData
    FROM TransactionHistory tr
    LEFT JOIN Staketable st On st.date = DATE(tr.createdAt)
    WHERE tr.identityId = '${identityId}' && type = '${type}' or type='stake'
    GROUP BY DATE(tr.createdAt)
    `;

  return select;
};

import { IGetStakeHistoryQuery } from '../dtos/get-stakedhistory.dto';

export const getStakedHistorySelect = (identityId: string, query: IGetStakeHistoryQuery) =>
  `with Staketable as (
    SELECT DATE(trs.createdAt) as date, trs.data as stakeInfo, trs.txHash 
    FROM TransactionHistory trs
    WHERE trs.identityId = '${identityId}' && type = 'stake'
    )
    
    SELECT st.*, p.count from Staketable st
    JOIN (select count(t.date) as count from Staketable t) p

    ${query.limit ? `LIMIT ${query.limit}` : ''}
    ${query.offset ? `OFFSET ${query.offset}` : ''}  
    `;

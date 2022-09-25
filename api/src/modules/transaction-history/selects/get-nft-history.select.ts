import { HISTORY_TYPES } from '@/db/enums';

export const getNftHistorySelect = (identityId: string, type: HISTORY_TYPES) => `
SELECT tr.identityId, CONVERT(sum(tr.amount * CONVERT(tr.price, INTEGER)), CHAR) as totalUSDC, sum(tr.amount) as totalAmount  
FROM TransactionHistory tr
WHERE tr.identityId = '${identityId}' && tr.type = '${type}'
`;

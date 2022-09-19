import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IdentityNftCreatorModel } from '@/db/models';
import { countHelper } from '@/common/utils';

@Injectable()
export class CreatorsService {
  constructor(@InjectModel(IdentityNftCreatorModel) private creator: typeof IdentityNftCreatorModel) {}

  async findAll(data: any) {
    const { limit, offset, search } = data;
    // TODO separate to helper
    const page = offset === 0 ? 0 : limit * offset - limit;
    const searchQuery = `

    with temptable as (
    SELECT DISTINCT cr.address, pr.avatar, id.id, pr.userName, id.accountType
    FROM Identity id
    JOIN BlockchainIdentityAddress bc On bc.identityId = id.id
    JOIN IdentityNftCreator cr ON cr.address = bc.address
    LEFT JOIN Profile pr On id.profileId = pr.id 
    ${search ? `WHERE pr.userName like '%${search}%'` : ''}
    )

    select tb.*, p.count from temptable tb 
    JOIN (select count(t.id) as count from temptable t) p
      
    ${limit ? `LIMIT ${limit}` : ''}
    ${page ? `OFFSET ${page}` : ''}

    `;

    const [dataFromDb] = await this.creator.sequelize.query(searchQuery);
    const { total, result } = countHelper(dataFromDb);
    return {
      data: result,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }
}

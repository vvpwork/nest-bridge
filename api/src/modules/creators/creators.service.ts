import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IdentityNftCreatorModel } from '@/db/models';
import { countHelper } from '@/common/utils';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectModel(IdentityNftCreatorModel) private creator: typeof IdentityNftCreatorModel,
  ) {}

  async findAll(data: any) {
    const { limit, offset, search } = data;
    // TODO separate to helper
    const page = offset === 0 ? 0 : limit * offset - limit;
    const searchQuery = `

    with temptable as (
    SELECT DISTINCT cr.address, pr.id as profileId, pr.avatar, pr.cover, id.id, pr.userName, pr.name, id.accountType, 
    IF(fl.id, 1, 0) as isFollowing,
    fol.count as followers
    FROM Identity id
    JOIN BlockchainIdentityAddress bc On bc.identityId = id.id
    JOIN IdentityNftCreator cr ON cr.address = bc.address
    LEFT JOIN Profile pr On id.profileId = pr.id 
    LEFT JOIN Follower fl On fl.profileId = pr.id
    LEFT JOIN (
      SELECT flw.targetProfileId, count(flw.id) as count from Follower flw
      GROUP BY flw.targetProfileId
    ) fol On fol.targetProfileId = pr.id
    ${search ? `WHERE pr.userName like '%${search}%'` : ''}
    GROUP BY cr.address
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

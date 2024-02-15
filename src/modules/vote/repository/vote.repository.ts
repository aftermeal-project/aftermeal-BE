import { Vote } from '../domain/vote.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Activity } from '../../activity/domain/activity.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VoteRepository extends Repository<Vote> {
  constructor(private readonly dataSource: DataSource) {
    super(Vote, dataSource.manager);
  }

  async findVotingActivities(strDate: string): Promise<Activity[]> {
    const result = await this.createQueryBuilder('v')
      .select('COUNT(*)', 'vote_count')
      .innerJoinAndSelect('v.activity', 'a')
      .where('DATE(v.created_at) = :date', { date: strDate })
      .groupBy('a.id')
      .orderBy('vote_count', 'DESC')
      .getRawMany();
    return plainToInstance(Activity, result);
  }
}

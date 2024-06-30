import { Injectable } from '@nestjs/common';
import { Vote } from '../domain/vote.entity';
import { ActivityService } from '../../activity/application/activity.service';
import { Activity } from '../../activity/domain/activity.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VoteService {
  constructor(
    private readonly activityService: ActivityService,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async vote(activityId: number, userId: number): Promise<void> {
    // TODO 현재 투표할 수 있는 상태인지 검증
    const activity: Activity =
      await this.activityService.getOneByActivityId(activityId);

    const vote: Vote = new Vote();
    vote.activity.id = activity.id;
    vote.user.id = userId;

    await this.voteRepository.save(vote);
  }
}

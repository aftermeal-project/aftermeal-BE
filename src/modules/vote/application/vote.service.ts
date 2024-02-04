import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Activity } from '../../activity/domain/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '../domain/vote.entity';
import { ActivityService } from '../../activity/application/activity.service';

@Injectable()
export class VoteService {
  constructor(
    private readonly activityService: ActivityService,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}
  async vote(activityId: number, userId: number): Promise<void> {
    const activity: Activity = await this.activityService.getActivity(
      activityId,
    );

    const vote: Vote = new Vote();
    vote.activityId = activity.id;
    vote.userId = userId;

    await this.voteRepository.save(vote);
  }
}

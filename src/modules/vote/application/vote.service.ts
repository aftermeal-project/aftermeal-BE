import { Injectable, NotFoundException } from '@nestjs/common';
import { VoteRequestDto } from '../dto/vote-request.dto';
import { Repository } from 'typeorm';
import { Activity } from '../../activity/domain/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '../domain/vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}
  async vote(dto: VoteRequestDto, userId: number): Promise<void> {
    const activity: Activity | null = await this.activityRepository.findOneBy({
      id: dto.activityId,
    });
    this.checkActivityExistence(activity);

    const vote: Vote = new Vote();
    vote.activityId = activity.id;
    vote.userId = userId;

    await this.voteRepository.save(vote);
  }

  private checkActivityExistence(activity: Activity | null): void {
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }
  }
}

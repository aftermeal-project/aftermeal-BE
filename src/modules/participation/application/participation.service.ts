import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Participation } from '../domain/participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../activity/domain/activity.entity';
import { ActivityService } from '../../activity/application/activity.service';

@Injectable()
export class ParticipationService {
  constructor(
    private readonly activityService: ActivityService,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  async apply(activityId: number, userId: number): Promise<void> {
    const activity: Activity = await this.activityService.getActivity(
      activityId,
    );
    if (!activity.selected) {
      throw new BadRequestException(
        '채택되지 않은 종목엔 참가를 신청할 수 없습니다.',
      );
    }

    const participation: Participation = new Participation();
    participation.activityId = activity.id;
    participation.userId = userId;

    await this.participationRepository.save(participation);
  }
}

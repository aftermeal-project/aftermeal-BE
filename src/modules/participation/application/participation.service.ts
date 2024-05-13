import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Participation } from '../domain/participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityService } from '../../activity/application/activity.service';
import { Activity } from '../../activity/domain/activity.entity';

@Injectable()
export class ParticipationService {
  constructor(
    private readonly activityService: ActivityService,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  async apply(activityId: number, userId: number): Promise<void> {
    const activity: Activity = await this.activityService.getOneByActivityId(
      activityId,
    );

    const participation: Participation = new Participation();
    participation.activityId = activity.id;
    participation.userId = userId;

    await this.participationRepository.save(participation);
  }
}

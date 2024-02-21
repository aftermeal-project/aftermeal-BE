import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../domain/activity.entity';
import { Participation } from '../../participation/domain/participation.entity';
import { ActivityDto } from '../dto/activity.dto';
import { ActivityRepository } from '../repository/activity.repository';
import { ActivityRepoDto } from '../dto/activity.repo.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  async getActivityById(activityId: number): Promise<Activity> {
    const activity: Activity = await this.activityRepository.findOneBy({
      id: activityId,
    });
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }
    return activity;
  }

  async getActivities(): Promise<ActivityDto[]> {
    const activitiesWithParticipantCounts: ActivityRepoDto[] =
      await this.activityRepository.findActivitiesWithParticipantCounts();

    return activitiesWithParticipantCounts.map(
      (activity) =>
        new ActivityDto(
          activity.id,
          activity.name,
          activity.maximumParticipants,
          activity.participantsCount,
        ),
    );
  }
}

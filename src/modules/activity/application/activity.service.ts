import { Inject, Injectable } from '@nestjs/common';
import { Activity } from '../domain/activity.entity';
import { ActivityRepository } from '../domain/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { ActivityResponseDto } from '../presentation/dto/activity-response.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async getActivities(): Promise<ActivityResponseDto[]> {
    const activities: Activity[] = await this.activityRepository.find();
    return activities.map((activity) => ActivityResponseDto.from(activity));
  }
}

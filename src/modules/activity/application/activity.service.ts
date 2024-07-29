import { Inject, Injectable } from '@nestjs/common';
import { Activity } from '../domain/activity.entity';
import { ActivityRepository } from '../domain/activity.repository';
import { ActivitySearchDto } from './dto/activity-search.dto';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityResDto } from '../presentation/dto/activity.res.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async getOneByActivityId(activityId: number): Promise<Activity> {
    const activity: Activity =
      await this.activityRepository.findOneByActivityId(activityId);
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }
    return activity;
  }

  async getAll(): Promise<ActivityResDto[]> {
    const activityDto: ActivitySearchDto[] =
      await this.activityRepository.findActivityDto();
    return activityDto.map((activity: ActivitySearchDto) =>
      ActivityResDto.from(activity),
    );
  }
}

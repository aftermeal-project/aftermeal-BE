import { Inject, Injectable } from '@nestjs/common';
import { Activity } from '../domain/activity.entity';
import { ActivityRepository } from '../domain/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivitySummaryDto } from '../infrastructure/dto/activity-summary.dto';
import { ActivitySummaryResponseDto } from '../presentation/dto/activity-summary-response.dto';
import { ActivityInfoResponseDto } from '../presentation/dto/activity-info-response.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async getActivityById(id: number): Promise<Activity> {
    const activity: Activity = await this.activityRepository.findById(id);
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }
    return activity;
  }

  async getActivityInfos(): Promise<ActivityInfoResponseDto[]> {
    const activities: Activity[] =
      await this.activityRepository.find();
    return activities.map((activity) => ActivityInfoResponseDto.from(activity));
  }

  async getActivitySummaries(): Promise<ActivitySummaryResponseDto[]> {
    const activities: ActivitySummaryDto[] =
      await this.activityRepository.findActivitySummaries();
    return activities.map((activity) =>
      ActivitySummaryResponseDto.from(activity),
    );
  }
}

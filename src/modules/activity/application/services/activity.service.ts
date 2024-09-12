import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityListDto } from '../../infrastructure/dto/activity-list.dto';
import { ActivityListResponseDto } from '../../presentation/dto/activity-list-response.dto';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityDetailResponseDto } from '../../presentation/dto/activity-detail-response.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async getActivityById(activityId: number): Promise<Activity> {
    const activity: Activity =
      await this.activityRepository.findOneById(activityId);
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동 항목입니다.');
    }
    return activity;
  }

  async getActivityList(): Promise<ActivityListResponseDto[]> {
    const activityDtos: ActivityListDto[] =
      await this.activityRepository.findActivityDtos();
    return activityDtos.map((dto) => ActivityListResponseDto.from(dto));
  }

  async getActivityDetails(
    activityId: number,
  ): Promise<ActivityDetailResponseDto> {
    const activity: Activity = await this.getActivityById(activityId);
    return ActivityDetailResponseDto.from(activity);
  }
}

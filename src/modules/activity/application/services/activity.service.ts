import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityListResponseDto } from '../../presentation/dto/activity-list-response.dto';
import { ActivityResponseDto } from '../../presentation/dto/activity-response.dto';
import { ActivityCreationRequestDto } from '../../presentation/dto/activity-creation-request.dto';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { ActivityUpdateRequestDto } from '../../presentation/dto/activity-update-request.dto';
import { ActivityLocationService } from '../../../activity-location/application/services/activity-location.service';
import { ZonedDateTime } from '@js-joda/core';
import { ActivityQueryDto } from '../../presentation/dto/activity-query.dto';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly activityLocationService: ActivityLocationService,
  ) {}

  async createActivity(
    dto: ActivityCreationRequestDto,
    currentDateTime: ZonedDateTime,
  ): Promise<void> {
    const activityLocation: ActivityLocation =
      await this.activityLocationService.getActivityLocationById(
        dto.activityLocationId,
      );

    const activity: Activity = Activity.create(
      dto.title,
      dto.maxParticipants,
      activityLocation,
      dto.type,
      dto.scheduledDate,
      currentDateTime,
    );
    await this.activityRepository.save(activity);
  }

  async getActivityListResponseByDate(
    query: ActivityQueryDto,
  ): Promise<ActivityListResponseDto[]> {
    const activities: Activity[] = await this.activityRepository.findByDate(
      query.date,
    );
    return activities.map((activity) => ActivityListResponseDto.from(activity));
  }

  async getActivityResponseById(
    activityId: number,
  ): Promise<ActivityResponseDto> {
    const activity: Activity = await this.getActivityById(activityId);
    return ActivityResponseDto.from(activity);
  }

  async updateActivity(
    activityId: number,
    dto: ActivityUpdateRequestDto,
  ): Promise<void> {
    const activity: Activity = await this.getActivityById(activityId);

    let activityLocation: ActivityLocation = activity.location;

    if (
      dto.activityLocationId &&
      dto.activityLocationId !== activity.location.id
    ) {
      activityLocation =
        await this.activityLocationService.getActivityLocationById(
          dto.activityLocationId,
        );
    }

    activity.update(
      dto.title,
      dto.maxParticipants,
      activityLocation,
      dto.type,
      dto.scheduledDate,
    );
    await this.activityRepository.save(activity);
  }

  async deleteActivity(activityId: number): Promise<void> {
    const activity: Activity = await this.getActivityById(activityId);
    await this.activityRepository.delete(activity);
  }

  async getActivityById(activityId: number): Promise<Activity> {
    const activity: Activity =
      await this.activityRepository.findOneById(activityId);

    if (!activity) {
      throw new ResourceNotFoundException('존재하지 않는 활동입니다.');
    }

    return activity;
  }
}

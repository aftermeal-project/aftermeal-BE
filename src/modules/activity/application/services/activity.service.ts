import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY, TIME } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivitySummaryResponseDto } from '../../presentation/dto/activity-summary-response.dto';
import { ActivityDetailResponseDto } from '../../presentation/dto/activity-detail-response.dto';
import { ActivityCreationRequestDto } from '../../presentation/dto/activity-creation-request.dto';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { ActivityUpdateRequestDto } from '../../presentation/dto/activity-update-request.dto';
import { ActivityLocationService } from '../../../activity-location/application/services/activity-location.service';
import { ZonedDateTime } from '@js-joda/core';
import { Time } from '@common/time/time';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly activityLocationService: ActivityLocationService,
    @Inject(TIME)
    private readonly time: Time,
  ) {}

  async createActivity(dto: ActivityCreationRequestDto): Promise<void> {
    const now: ZonedDateTime = this.time.now();

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
      now,
    );
    await this.activityRepository.save(activity);
  }

  async getActivitySummaries(): Promise<ActivitySummaryResponseDto[]> {
    const activities: Activity[] = await this.activityRepository.find();
    return activities.map((activity) =>
      ActivitySummaryResponseDto.from(activity),
    );
  }

  async getActivityById(activityId: number): Promise<Activity> {
    const activity: Activity =
      await this.activityRepository.findOneById(activityId);

    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동 항목입니다.');
    }

    return activity;
  }

  async getActivityDetailById(
    activityId: number,
  ): Promise<ActivityDetailResponseDto> {
    const activity: Activity = await this.getActivityById(activityId);
    return ActivityDetailResponseDto.from(activity);
  }

  async updateActivity(
    activityId: number,
    dto: ActivityUpdateRequestDto,
  ): Promise<void> {
    const activity: Activity = await this.getActivityById(activityId);

    const activityLocation: ActivityLocation =
      await this.activityLocationService.getActivityLocationById(
        dto.activityLocationId,
      );

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
}

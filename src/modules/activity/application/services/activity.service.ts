import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivitySummaryDto } from '../../infrastructure/dto/activity-summary.dto';
import { Activity } from '../../domain/entities/activity.entity';
import { Participation } from '../../../participation/domain/entities/participation.entity';
import { ActivitySummaryResponseDto } from '../../presentation/dto/activity-summary-response.dto';
import { ActivityDetailResponseDto } from '../../presentation/dto/activity-detail-response.dto';
import { ActivityCreationRequestDto } from '../../presentation/dto/activity-creation-request.dto';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { ActivityUpdateRequestDto } from '../../presentation/dto/activity-update-request.dto';
import { ActivityLocationService } from '../../../activity-location/application/services/activity-location.service';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly activityLocationService: ActivityLocationService,
  ) {}

  async createActivity(dto: ActivityCreationRequestDto): Promise<void> {
    const activityLocation: ActivityLocation =
      await this.activityLocationService.getActivityLocationById(
        dto.locationId,
      );

    const activity: Activity = Activity.create(
      dto.title,
      dto.maxParticipants,
      activityLocation,
      dto.type,
      dto.scheduledDate,
    );
    await this.activityRepository.save(activity);
  }

  async getActivitySummaries(): Promise<ActivitySummaryResponseDto[]> {
    const activitySummaryDtos: ActivitySummaryDto[] =
      await this.activityRepository.findActivitySummary();
    return activitySummaryDtos.map((dto) =>
      ActivitySummaryResponseDto.from(dto),
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
    const participations: Participation[] = await activity.participations;

    return ActivityDetailResponseDto.from(activity, participations);
  }

  async updateActivity(
    activityId: number,
    dto: ActivityUpdateRequestDto,
  ): Promise<void> {
    const activity: Activity = await this.getActivityById(activityId);

    const activityLocation: ActivityLocation =
      await this.activityLocationService.getActivityLocationById(
        dto.locationId,
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

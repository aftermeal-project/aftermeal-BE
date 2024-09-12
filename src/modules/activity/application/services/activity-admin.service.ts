import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ActivityCreationRequestDto } from '../../presentation/dto/activity-creation-request.dto';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { Activity } from '../../domain/entities/activity.entity';
import { ActivityLocationAdminService } from '../../../activity-location/application/services/activity-location-admin.service';
import { ActivityUpdateRequestDto } from '../../presentation/dto/activity-update-request.dto';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityDetailResponseDto } from '../../presentation/dto/activity-detail-response.dto';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityAdminResponseDto } from '../../presentation/dto/activity-admin-response.dto';
import { Participation } from '../../../participation/domain/entities/participation.entity';

@Injectable()
export class ActivityAdminService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly activityLocationService: ActivityLocationAdminService,
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

  async getActivityById(activityId: number): Promise<Activity> {
    const activity: Activity =
      await this.activityRepository.findOneById(activityId);
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동 항목입니다.');
    }
    return activity;
  }

  async getAllActivities(): Promise<ActivityAdminResponseDto[]> {
    const activities: Activity[] = await this.activityRepository.find();
    return await Promise.all(
      activities.map(async (activity) => {
        const participations: Participation[] = await activity.participations;
        return ActivityAdminResponseDto.from(activity, participations);
      }),
    );
  }

  async getActivityDetails(
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

import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../domain/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityDto } from '../infrastructure/dto/activity.dto';
import { ActivityResponseDto } from '../presentation/dto/activity-response.dto';
import { Activity } from '../domain/entities/activity.entity';
import { ActivityCreationRequestDto } from '../presentation/dto/activity-creation-request.dto';
import { ActivityLocation } from '../../activity-location/domain/entities/activity-location.entity';
import { ActivityLocationService } from '../../activity-location/application/activity-location.service';
import { ActivityUpdateRequestDto } from '../presentation/dto/activity-update-request.dto';
import { ActivityDetailResponseDto } from '../presentation/dto/activity-detail-response.dto';
import { ParticipationService } from '../../participation/application/participation.service';
import { User } from '../../user/domain/entities/user.entity';
import { ActivityParticipationResponseDto } from '../presentation/dto/activity-participation-response.dto';
import { Participation } from '../../participation/domain/entities/participation.entity';

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    private readonly activityLocationService: ActivityLocationService,
    private readonly participationService: ParticipationService,
  ) {}

  async createActivity(dto: ActivityCreationRequestDto): Promise<number> {
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

    return activity.id;
  }

  async participate(
    activityId: number,
    user: User,
  ): Promise<ActivityParticipationResponseDto> {
    const activity: Activity = await this.getActivityByActivityId(activityId);
    const participation: Participation =
      await this.participationService.participate(activity, user);

    return ActivityParticipationResponseDto.from(participation);
  }

  async getActivityByActivityId(activityId: number): Promise<Activity> {
    const activity: Activity =
      await this.activityRepository.findOneById(activityId);

    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동 항목입니다.');
    }

    return activity;
  }

  async getActivityList(): Promise<ActivityResponseDto[]> {
    const activityDtos: ActivityDto[] =
      await this.activityRepository.findActivityDtos();
    return activityDtos.map((dto) => ActivityResponseDto.from(dto));
  }

  async getActivityDetails(
    activityId: number,
  ): Promise<ActivityDetailResponseDto> {
    const activity: Activity = await this.getActivityByActivityId(activityId);
    return ActivityDetailResponseDto.from(activity);
  }

  async updateActivity(activityId: number, dto: ActivityUpdateRequestDto) {
    const activity: Activity = await this.getActivityByActivityId(activityId);

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

  async cancelActivityJoin(activityId: number, user: User) {
    const activity: Activity = await this.getActivityByActivityId(activityId);
    await this.participationService.cancelParticipation(activity, user);
  }

  async deleteActivity(activityId: number) {
    const activity: Activity = await this.getActivityByActivityId(activityId);
    await this.activityRepository.delete(activity);
  }
}

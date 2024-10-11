import { Inject, Injectable } from '@nestjs/common';
import { ACTIVITY_LOCATION_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityLocationRepository } from '../../domain/repositories/activity-location.repository';
import { ActivityLocation } from '../../domain/entities/activity-location.entity';
import { ActivityLocationResponseDto } from '../../presentation/dto/activity-location-response.dto';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { ActivityLocationUpdateRequestDto } from '../../presentation/dto/activity-location-update-request.dto';
import { ActivityLocationCreationRequestDto } from '../../presentation/dto/activity-location-creation-request.dto';

@Injectable()
export class ActivityLocationService {
  constructor(
    @Inject(ACTIVITY_LOCATION_REPOSITORY)
    private readonly activityLocationRepository: ActivityLocationRepository,
  ) {}

  async createActivityLocation(
    dto: ActivityLocationCreationRequestDto,
  ): Promise<void> {
    const existingLocation: ActivityLocation =
      await this.activityLocationRepository.findOneByName(dto.name);

    if (existingLocation) {
      throw new AlreadyExistException('이미 존재하는 활동 장소입니다.');
    }

    const activityLocation: ActivityLocation = ActivityLocation.create(
      dto.name,
    );
    await this.activityLocationRepository.save(activityLocation);
  }

  async getActivityLocationById(id: number): Promise<ActivityLocation> {
    const activityLocation: ActivityLocation =
      await this.activityLocationRepository.findOneById(id);
    if (!activityLocation) {
      throw new ResourceNotFoundException('존재하지 않는 활동 장소입니다.');
    }
    return activityLocation;
  }

  async getActivityLocations(): Promise<ActivityLocationResponseDto[]> {
    const activityLocations: ActivityLocation[] =
      await this.activityLocationRepository.find();
    return activityLocations.map((location) =>
      ActivityLocationResponseDto.from(location),
    );
  }

  async updateActivityLocation(
    activityLocationId: number,
    dto: ActivityLocationUpdateRequestDto,
  ): Promise<void> {
    const activityLocation: ActivityLocation =
      await this.getActivityLocationById(activityLocationId);
    activityLocation.updateName(dto.name);
    await this.activityLocationRepository.save(activityLocation);
  }

  async deleteActivityLocation(activityLocationId: number): Promise<void> {
    const activityLocation: ActivityLocation =
      await this.getActivityLocationById(activityLocationId);
    await this.activityLocationRepository.delete(activityLocation);
  }
}

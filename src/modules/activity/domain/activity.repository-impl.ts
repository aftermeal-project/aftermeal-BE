import { Activity } from './activity.entity';
import { ActivityRepoDto } from '../dto/activity.repo.dto';
import { Injectable } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityRepositoryImpl implements ActivityRepository {
  constructor(private readonly activityRepository: Repository<Activity>) {}

  create(activity: Activity): Activity {
    return this.activityRepository.create(activity);
  }

  async save(activity: Activity): Promise<Activity> {
    return await this.activityRepository.save(activity);
  }

  async findOneById(activityId: number): Promise<Activity> {
    return await this.activityRepository.findOneBy({
      id: activityId,
    });
  }

  async findActivitiesWithParticipantCounts(): Promise<ActivityRepoDto[]> {
    return await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.participation', 'participation')
      .select('activity.id', 'id')
      .addSelect('activity.name', 'name')
      .addSelect('activity.maximumParticipants', 'maximumParticipants')
      .addSelect('COUNT(participation.id)', 'participantsCount')
      .groupBy('activity.id')
      .getRawMany();
  }

  async delete(): Promise<void> {
    await this.activityRepository.delete({});
  }
}

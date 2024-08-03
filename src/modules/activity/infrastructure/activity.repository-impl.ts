import { Activity } from '../domain/activity.entity';
import { ActivityDetailsDBDTO } from './dto/activity-details.db.dto';
import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../domain/activity.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ActivityRepositoryImpl implements ActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async save(activity: Activity): Promise<Activity> {
    return await this.activityRepository.save(activity);
  }

  async saveAll(activities: Activity[]): Promise<Activity[]> {
    return await this.activityRepository.save(activities);
  }

  async findOneByActivityId(activityId: number): Promise<Activity> {
    return await this.activityRepository.findOneBy({
      id: activityId,
    });
  }

  async findActivityDTO(): Promise<ActivityDetailsDBDTO[]> {
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

  async clear(): Promise<void> {
    await this.activityRepository.delete({});
  }
}

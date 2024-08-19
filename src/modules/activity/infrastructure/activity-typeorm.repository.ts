import { Activity } from '../domain/activity.entity';
import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../domain/activity.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivitySummaryDto } from './dto/activity-summary.dto';

@Injectable()
export class ActivityTypeOrmRepository implements ActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async save(activity: Activity): Promise<Activity> {
    return await this.repository.save(activity);
  }

  async saveAll(activities: Activity[]): Promise<Activity[]> {
    return await this.repository.save(activities);
  }

  async findById(id: number): Promise<Activity> {
    return await this.repository.findOneBy({
      id: id,
    });
  }

  async find(): Promise<Activity[]> {
    return await this.repository.find();
  }

  async findActivitySummaries(): Promise<ActivitySummaryDto[]> {
    const raw = await this.buildActivitySummariesSelectQuery().getRawMany();

    return raw.map(
      (activity) =>
        new ActivitySummaryDto(
          activity.id,
          activity.name,
          activity.maxParticipants,
          Number(activity.currentParticipants),
        ),
    );
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }

  private buildActivitySummariesSelectQuery(): SelectQueryBuilder<Activity> {
    return this.repository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.participation', 'participation')
      .select('activity.id', 'id')
      .addSelect('activity.name', 'name')
      .addSelect('activity.maxParticipants', 'maxParticipants')
      .addSelect('COUNT(participation.id)', 'currentParticipants')
      .groupBy('activity.id');
  }
}

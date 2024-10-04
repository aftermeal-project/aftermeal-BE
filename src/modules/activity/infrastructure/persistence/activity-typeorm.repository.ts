import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ActivitySummaryDto } from '../dto/activity-summary.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../domain/entities/activity.entity';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityTypeormRepository implements ActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async find(): Promise<Activity[]> {
    return await this.repository.find();
  }

  async findOneById(id: number): Promise<Activity> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findActivitySummary(): Promise<ActivitySummaryDto[]> {
    const raw = await this.buildActivitySummarySelectQuery().getRawMany();
    return raw.map((raw) =>
      plainToInstance(ActivitySummaryDto, raw, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async save(activity: Activity): Promise<void> {
    await this.repository.save(activity);
  }

  async saveAll(activities: Activity[]): Promise<void> {
    await this.repository.save(activities);
  }

  async delete(activity: Activity): Promise<void> {
    await this.repository.delete({
      id: activity.id,
    });
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }

  private buildActivitySummarySelectQuery(): SelectQueryBuilder<Activity> {
    return this.repository
      .createQueryBuilder('activity')
      .leftJoin('activity.participations', 'participation')
      .leftJoinAndSelect('activity.location', 'location')
      .select([
        'activity.id',
        'activity.title',
        'activity.maxParticipants',
        'activity.type',
        'activity.scheduledDate',
        'activity.applicationStartAt',
        'activity.applicationEndAt',
        'location',
      ])
      .addSelect('COUNT(participation.id)', 'activity_current_participants')
      .groupBy('activity.id')
      .addGroupBy('location.id');
  }
}

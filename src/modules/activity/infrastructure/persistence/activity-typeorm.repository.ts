import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { ActivitySummaryDto } from '../dto/activity-summary.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../domain/entities/activity.entity';

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
    const raw = await this.buildActivityDtoSelectQuery().getRawMany();
    return raw.map(
      (activity) =>
        new ActivitySummaryDto(
          activity.id,
          activity.title,
          activity.location,
          activity.maxParticipants,
          Number(activity.currentParticipants),
          activity.status,
          activity.type,
          activity.scheduledDate,
        ),
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

  private buildActivityDtoSelectQuery(): SelectQueryBuilder<Activity> {
    return this.repository
      .createQueryBuilder('activity')
      .leftJoin('activity.participations', 'participation')
      .select('activity.id', 'id')
      .addSelect('activity.title', 'title')
      .addSelect('activity.maxParticipants', 'maxParticipants')
      .addSelect('COUNT(DISTINCT participation.id)', 'currentParticipants')
      .groupBy('activity.id');
  }
}
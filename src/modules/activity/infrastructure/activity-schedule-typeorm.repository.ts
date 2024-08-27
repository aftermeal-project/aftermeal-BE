import { ActivityScheduleRepository } from '../domain/repositories/activity-schedule.repository';
import { ActivityScheduleSummaryDto } from './dto/activity-schedule-summary.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ActivitySchedule } from '../domain/entities/activity-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class ActivityScheduleTypeormRepository
  implements ActivityScheduleRepository
{
  constructor(
    @InjectRepository(ActivitySchedule)
    private readonly repository: Repository<ActivitySchedule>,
  ) {}

  async findById(id: number): Promise<ActivitySchedule> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findActivitySummaries(): Promise<ActivityScheduleSummaryDto[]> {
    const raw =
      await this.buildActivityScheduleSummariesSelectQuery().getRawMany();

    return raw.map(
      (activity) =>
        new ActivityScheduleSummaryDto(
          activity.id,
          activity.name,
          activity.maxParticipants,
          Number(activity.currentParticipants),
        ),
    );
  }

  async save(activity: ActivitySchedule): Promise<void> {
    await this.repository.save(activity);
  }

  async saveAll(activities: ActivitySchedule[]): Promise<void> {
    await this.repository.save(activities);
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }

  private buildActivityScheduleSummariesSelectQuery(): SelectQueryBuilder<ActivitySchedule> {
    return this.repository
      .createQueryBuilder('activitySchedule')
      .leftJoin('activitySchedule.participation', 'participation')
      .leftJoin('activitySchedule.activity', 'activity')
      .select('activitySchedule.id', 'id')
      .addSelect('activity.name', 'name')
      .addSelect('activity.maxParticipants', 'maxParticipants')
      .addSelect('COUNT(DISTINCT participation.id)', 'currentParticipants')
      .groupBy('activitySchedule.id');
  }
}

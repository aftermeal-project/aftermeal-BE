import { ActivityRepository } from '../../domain/repositories/activity.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../../domain/entities/activity.entity';
import { LocalDate } from '@js-joda/core';

export class ActivityTypeormRepository implements ActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async find(): Promise<Activity[]> {
    return await this.repository.find();
  }

  async findByDate(date: LocalDate): Promise<Activity[]> {
    return await this.repository.find({
      where: { scheduledDate: date.toString() },
    });
  }

  async findOneById(id: number): Promise<Activity> {
    return await this.repository.findOne({ where: { id: id } });
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
}

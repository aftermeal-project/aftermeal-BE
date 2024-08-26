import { Activity } from '../domain/activity.entity';
import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../domain/activity.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityTypeormRepository implements ActivityRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {}

  async save(activity: Activity): Promise<void> {
    await this.repository.save(activity);
  }

  async saveAll(activities: Activity[]): Promise<void> {
    await this.repository.save(activities);
  }

  async find(): Promise<Activity[]> {
    return await this.repository.find();
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}

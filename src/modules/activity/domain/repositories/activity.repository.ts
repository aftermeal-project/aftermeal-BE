import { Activity } from '../entities/activity.entity';
import { LocalDate } from '@js-joda/core';

export interface ActivityRepository {
  find(): Promise<Activity[]>;
  findByScheduledDate(scheduledDate: LocalDate): Promise<Activity[]>;
  findOneById(id: number): Promise<Activity | null>;
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  delete(activity: Activity): Promise<void>;
  deleteAll(): Promise<void>;
}

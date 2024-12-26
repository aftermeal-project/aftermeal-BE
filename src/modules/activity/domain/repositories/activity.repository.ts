import { Activity } from '../entities/activity.entity';
import { LocalDate } from '@js-joda/core';
import { EActivityType } from '../entities/activity-type';

export interface ActivityRepository {
  find(filter?: {
    scheduledDate: LocalDate;
    type: EActivityType;
  }): Promise<Activity[]>;
  findOneById(id: number): Promise<Activity | null>;
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  delete(activity: Activity): Promise<void>;
  deleteAll(): Promise<void>;
}

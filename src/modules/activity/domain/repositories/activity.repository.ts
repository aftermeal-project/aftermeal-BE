import { Activity } from '../entities/activity.entity';

export interface ActivityRepository {
  find(filter?: { scheduledDate: string }): Promise<Activity[]>;
  findOneById(id: number): Promise<Activity | null>;
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  delete(activity: Activity): Promise<void>;
  deleteAll(): Promise<void>;
}

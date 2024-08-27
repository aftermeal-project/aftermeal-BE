import { Activity } from './activity.entity';

export interface ActivityRepository {
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  find(): Promise<Activity[]>;
  deleteAll(): Promise<void>;
}

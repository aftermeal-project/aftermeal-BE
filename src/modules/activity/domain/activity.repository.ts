import { Activity } from './activity.entity';

export interface ActivityRepository {
  save(activityItem: Activity): Promise<void>;
  saveAll(activityItems: Activity[]): Promise<void>;
  find(): Promise<Activity[]>;
  deleteAll(): Promise<void>;
}

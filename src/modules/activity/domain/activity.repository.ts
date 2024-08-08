import { Activity } from './activity.entity';
import { ActivitySummaryDto } from '../infrastructure/dto/activity-summary.dto';

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>;
  saveAll(activities: Activity[]): Promise<Activity[]>;
  findById(id: number): Promise<Activity | null>;
  find(): Promise<Activity[]>;
  findActivitySummaries(): Promise<ActivitySummaryDto[]>;
  deleteAll(): Promise<void>;
}

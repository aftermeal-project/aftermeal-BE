import { ActivitySummaryDto } from '../../infrastructure/dto/activity-summary.dto';
import { Activity } from '../entities/activity.entity';

export interface ActivityRepository {
  find(): Promise<Activity[]>;
  findOneById(id: number): Promise<Activity | null>;
  findActivitySummary(): Promise<ActivitySummaryDto[]>;
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  delete(activity: Activity): Promise<void>;
  deleteAll(): Promise<void>;
}

import { ActivitySearchDto } from '../application/dto/activity-search.dto';
import { Activity } from './activity.entity';

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>;
  saveAll(activities: Activity[]): Promise<Activity[]>;
  findOneByActivityId(activityId: number): Promise<Activity>;
  findActivityDto(): Promise<ActivitySearchDto[]>;
  clear(): Promise<void>;
}

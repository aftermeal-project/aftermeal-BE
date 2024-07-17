import { ActivityDto } from '../application/dto/activity.dto';
import { Activity } from './activity.entity';

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>;
  saveAll(activities: Activity[]): Promise<Activity[]>;
  findOneByActivityId(activityId: number): Promise<Activity>;
  findActivityDto(): Promise<ActivityDto[]>;
  clear(): Promise<void>;
}

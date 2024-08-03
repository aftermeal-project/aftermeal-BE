import { ActivityDetailsDto } from '../infrastructure/dto/activity-details.dto';
import { Activity } from './activity.entity';

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>;
  saveAll(activities: Activity[]): Promise<Activity[]>;
  findOneByActivityId(activityId: number): Promise<Activity>;
  findActivityDto(): Promise<ActivityDetailsDto[]>;
  clear(): Promise<void>;
}

import { ActivityDetailsDBDTO } from '../infrastructure/dto/activity-details.db.dto';
import { Activity } from './activity.entity';

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>;
  saveAll(activities: Activity[]): Promise<Activity[]>;
  findOneByActivityId(activityId: number): Promise<Activity>;
  findActivityDTO(): Promise<ActivityDetailsDBDTO[]>;
  clear(): Promise<void>;
}

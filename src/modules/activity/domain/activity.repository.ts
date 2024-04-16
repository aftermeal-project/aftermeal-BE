import { ActivityDto } from '../dto/activity.dto';
import { Activity } from './activity.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export interface ActivityRepository {
  create(activity: DeepPartial<Activity>): Activity;
  save(activity: Activity): Promise<Activity>;
  findOneByActivityId(activityId: number): Promise<Activity>;
  findActivityDto(): Promise<ActivityDto[]>;
  delete(): Promise<void>;
}

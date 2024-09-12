import { ActivityListDto } from '../../infrastructure/dto/activity-list.dto';
import { Activity } from '../entities/activity.entity';

export interface ActivityRepository {
  find(): Promise<Activity[]>;
  findOneById(id: number): Promise<Activity | null>;
  findActivityDtos(): Promise<ActivityListDto[]>;
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  delete(activity: Activity): Promise<void>;
  deleteAll(): Promise<void>;
}

import { ActivityDto } from '../../infrastructure/dto/activity.dto';
import { Activity } from '../entities/activity.entity';

export interface ActivityRepository {
  findOneById(id: number): Promise<Activity | null>;
  findActivityDtos(): Promise<ActivityDto[]>;
  save(activity: Activity): Promise<void>;
  saveAll(activities: Activity[]): Promise<void>;
  delete(activity: Activity): Promise<void>;
  deleteAll(): Promise<void>;
}

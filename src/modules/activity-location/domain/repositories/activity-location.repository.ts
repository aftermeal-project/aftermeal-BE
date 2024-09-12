import { ActivityLocation } from '../entities/activity-location.entity';

export interface ActivityLocationRepository {
  find(): Promise<ActivityLocation[]>;
  findOneById(id: number): Promise<ActivityLocation>;
  findOneByName(name: string): Promise<ActivityLocation>;
  save(activityLocation: ActivityLocation): Promise<void>;
  delete(activityLocation: ActivityLocation): Promise<void>;
  deleteAll(): Promise<void>;
}

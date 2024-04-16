import { ActivityRepoDto } from '../dto/activity.repo.dto';
import { Activity } from './activity.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export interface ActivityRepository {
  create(activity: DeepPartial<Activity>): Activity;
  save(activity: Activity): Promise<Activity>;
  findOneById(activityId: number): Promise<Activity>;
  findActivitiesWithParticipantCounts(): Promise<ActivityRepoDto[]>;
  delete(): Promise<void>;
}

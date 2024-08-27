import { ActivityScheduleSummaryDto } from '../../infrastructure/dto/activity-schedule-summary.dto';
import { ActivitySchedule } from '../entities/activity-schedule.entity';

export interface ActivityScheduleRepository {
  findById(id: number): Promise<ActivitySchedule | null>;
  findActivitySummaries(): Promise<ActivityScheduleSummaryDto[]>;
  save(activity: ActivitySchedule): Promise<void>;
  saveAll(activities: ActivitySchedule[]): Promise<void>;
  deleteAll(): Promise<void>;
}

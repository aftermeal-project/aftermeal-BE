import { BaseTimeEntity } from '@common/models/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { DAY_OF_WEEK } from '../types/day-of-week';
import { EActivityScheduleType } from '../types/activity-schedule-type';
import { Participation } from '../../../participation/domain/participation.entity';
import { ActivityScheduleTypeTransformer } from '../types/activity-schedule-type.transformer';

@Entity()
export class ActivitySchedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: DAY_OF_WEEK;

  @Column({
    transformer: new ActivityScheduleTypeTransformer(),
  })
  type: EActivityScheduleType;

  @ManyToOne(() => Activity)
  @JoinColumn({
    name: 'activity_id',
    foreignKeyConstraintName: 'fk_activity_schedule_activity',
  })
  activity: Activity;

  @OneToMany(
    () => Participation,
    (participation) => participation.activitySchedule,
  )
  participation: Participation[];

  static create(
    day: DAY_OF_WEEK,
    type: EActivityScheduleType,
    activity: Activity,
  ): ActivitySchedule {
    const activitySchedule = new ActivitySchedule();
    activitySchedule.dayOfWeek = day;
    activitySchedule.type = type;
    activitySchedule.activity = activity;
    return activitySchedule;
  }
}

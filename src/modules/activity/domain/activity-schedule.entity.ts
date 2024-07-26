import { BaseTimeEntity } from '@common/entities/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

enum DAY_OF_WEEK {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
}

enum TimeSlot {
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

@Entity()
export class ActivitySchedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: DAY_OF_WEEK;

  @Column()
  timeSlot: TimeSlot;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;
}

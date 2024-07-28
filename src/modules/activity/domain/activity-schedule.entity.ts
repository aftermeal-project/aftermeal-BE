import { BaseTimeEntity } from '@common/entities/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { DAY_OF_WEEK } from './day-of-week';
import { TimeSlot } from './time-slot';

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

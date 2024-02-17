import { BaseTimeEntity } from '@common/model/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityInfo } from './activity-info.entity';

enum DAY_OF_WEEK {
  MONDAY = '월요일',
  TUESDAY = '화요일',
  WEDNESDAY = '수요일',
  THURSDAY = '목요일',
  FRIDAY = '금요일',
}

enum TimeSlot {
  LUNCH = '점심',
  DINNER = '저녁',
}

@Entity()
export class ActivitySchedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: DAY_OF_WEEK;

  @Column()
  timeSlot: TimeSlot;

  @Column()
  activityInfoId: number;

  @ManyToOne(() => ActivityInfo)
  @JoinColumn({ name: 'activity_info_id' })
  activityInfo: ActivityInfo;
}

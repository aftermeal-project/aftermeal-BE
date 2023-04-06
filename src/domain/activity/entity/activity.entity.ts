import { BaseTimeEntity } from '../../../global/entity/base-time.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { TimeSlot } from './time-slot';
import { ActivityCode } from './activity-code.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryColumn({ name: 'activity_id' })
  activityId: number;

  @Column({ name: 'start_date_time', type: 'datetime', nullable: false })
  startTime: Date;

  @Column({ name: 'end_date_time', type: 'datetime', nullable: false })
  endTime: Date;

  @Column({
    name: 'time_slot',
    type: 'enum',
    enum: ['DAY', 'NIGHT', 'NONE'],
    default: 'NONE',
  })
  timeSlot: TimeSlot;

  @OneToOne(() => ActivityCode, { nullable: false, cascade: true, eager: true })
  @JoinColumn({ name: 'activity_code_id' })
  activityCode: ActivityCode;
}

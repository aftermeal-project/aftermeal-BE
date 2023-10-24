import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { TimeZone } from './time-zone';
import { ActivityItem } from './activity-item.entity';
import { ActivityStatus } from './activity-status';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'enum', enum: TimeZone.values() })
  mealTime: TimeZone;

  @Column({ type: 'enum', enum: ActivityStatus.values() })
  status: ActivityStatus;

  @OneToOne(() => ActivityItem, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'activity_item_id' })
  activityItem: ActivityItem;
}

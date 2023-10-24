import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityItem } from './activity-item.entity';
import { ActivityStatus } from './activity-status.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ActivityItem, {
    eager: true,
  })
  @JoinColumn({ name: 'activity_item_id' })
  activityItem: ActivityItem;

  @OneToOne(() => ActivityStatus, {
    eager: true,
  })
  @JoinColumn({ name: 'activity_status_id' })
  activityStatus: ActivityStatus;
}

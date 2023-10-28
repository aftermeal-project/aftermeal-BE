import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityItem } from './activity-item.entity';
import { ActivityState } from './activity-state.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ActivityItem, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'activity_item_id' })
  activityItem: ActivityItem;

  @OneToOne(() => ActivityState, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'activity_status_id' })
  activityStatus: ActivityState;
}

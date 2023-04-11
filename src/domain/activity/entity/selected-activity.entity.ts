import { BaseTimeEntity } from '../../../global/entity/base-time.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class SelectedActivity extends BaseTimeEntity {
  @PrimaryColumn({ name: 'selected_activity_id' })
  selectedActivityId: number;

  @OneToOne(() => Activity, { nullable: false, cascade: true })
  @JoinColumn({ name: 'selected_activity_id' })
  activity: Activity;
}

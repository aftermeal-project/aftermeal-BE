import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class SelectedActivity extends BaseTimeEntity {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Activity, { cascade: true })
  @JoinColumn({ name: 'selected_activity_id' })
  selectedActivity: Activity;
}

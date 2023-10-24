import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { User } from '../../user/domain/user.entity';
import { Activity } from '../../activity/domain/activity.entity';
import { SelectedActivity } from '../../activity/domain/selected-activity.entity';

@Entity()
export class Participation extends BaseTimeEntity {
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Activity, { cascade: true })
  @JoinColumn({ name: 'selected_activity_id' })
  selectedActivity: SelectedActivity;
}

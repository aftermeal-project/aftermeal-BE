import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { User } from '../../user/domain/user.entity';
import { Activity } from '../../activity/domain/activity.entity';
import { SelectedActivity } from '../../activity/domain/selected-activity.entity';

@Entity()
export class Participation extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'participation_application_id' })
  id: number;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Activity, { cascade: true })
  @JoinColumn({ name: 'selected_activity_id' })
  selectedActivity: SelectedActivity;
}

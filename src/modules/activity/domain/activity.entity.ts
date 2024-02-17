import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityInfo } from './activity-info.entity';
import { Participation } from '../../participation/domain/participation.entity';
import { BaseTimeEntity } from '@common/model/base-time.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ActivityInfo, { eager: true })
  @JoinColumn({ name: 'activity_info_id' })
  activityInfo: ActivityInfo;

  @OneToMany(() => Participation, (participation) => participation.activity)
  @JoinColumn({ name: 'participation_id' })
  participation: Participation;
}

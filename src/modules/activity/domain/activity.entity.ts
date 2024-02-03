import { BaseTimeEntity } from '@common/model/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityDetail } from './activity-detail.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  selected: boolean;

  @OneToOne(() => ActivityDetail, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'activity_item_id' })
  detail: ActivityDetail;
}

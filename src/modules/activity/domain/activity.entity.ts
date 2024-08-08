import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participation } from '../../participation/domain/participation.entity';
import { BaseTimeEntity } from '@common/models/base-time.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  maxParticipants: number;

  @OneToMany(() => Participation, (participation) => participation.activity)
  participation: Participation[];

  static create(name: string, maxParticipants: number): Activity {
    const activity = new Activity();
    activity.name = name;
    activity.maxParticipants = maxParticipants;
    return activity;
  }
}

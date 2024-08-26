import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  maxParticipants: number;

  static create(name: string, maxParticipants: number): Activity {
    const activity = new Activity();
    activity.name = name;
    activity.maxParticipants = maxParticipants;
    return activity;
  }
}

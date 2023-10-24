import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Time } from './time';

@Entity()
export class ActivityStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({ enum: Time.values() })
  timeSlot: Time;
}

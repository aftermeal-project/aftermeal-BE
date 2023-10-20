import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActivityItem {
  @PrimaryGeneratedColumn({ name: 'activity_item_id' })
  id: number;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'maximum_participants', default: 0 })
  maximumParticipants: number;
}

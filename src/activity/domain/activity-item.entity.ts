import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActivityItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  maximumParticipants: number;
}

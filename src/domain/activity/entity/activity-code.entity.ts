import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActivityCode {
  @PrimaryGeneratedColumn({ name: 'activity_code_id' })
  activityCodeId: number;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'maximum_participants', nullable: false, default: 0 })
  maximumParticipants: number;
}

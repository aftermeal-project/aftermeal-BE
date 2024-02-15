import { BaseTimeEntity } from '@common/model/base-time.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  maximumParticipants: number;

  @Column({ default: false })
  selected: boolean;
}

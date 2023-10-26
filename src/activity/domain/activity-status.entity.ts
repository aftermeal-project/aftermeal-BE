import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActivityStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;
}

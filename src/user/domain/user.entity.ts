import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { Generation } from './generation.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  type: string;

  @Column()
  enabled: boolean;

  @Column({ nullable: true })
  generationNumber: number;

  @OneToOne(() => Generation)
  @JoinColumn({ name: 'generation_number' })
  generation: Generation;
}

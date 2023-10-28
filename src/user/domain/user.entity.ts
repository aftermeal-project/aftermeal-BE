import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { Generation } from './generation.entity';
import { UserRole } from './user-role.entity';

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

  @Column({ default: false })
  enabled: boolean;

  @Column({ nullable: true })
  generationNumber: number;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  role: UserRole[];

  @OneToOne(() => Generation)
  @JoinColumn({ name: 'generation_number' })
  generation: Generation;
}

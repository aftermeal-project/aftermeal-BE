import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { UserRole } from './user-role.entity';
import { Generation } from './generation.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'enabled' })
  enabled: boolean;

  @Column({ name: 'generation_number', nullable: true })
  generationNumber: number;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRole: UserRole;

  @OneToOne(() => Generation)
  @JoinColumn({ name: 'generation_number' })
  generation: Generation;
}

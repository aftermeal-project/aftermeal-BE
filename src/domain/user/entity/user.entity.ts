import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'uuid', nullable: false, unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'generation', nullable: false })
  generation: number;

  @Column({ name: 'student_id', nullable: true, unique: true, default: null })
  studentId: number | null;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ['GUEST', 'STUDENT', 'GRADUATE', 'ADMIN'],
    default: 'GUEST',
  })
  role: Role;
}

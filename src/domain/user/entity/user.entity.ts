import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';
import { Student } from './student.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'uuid', nullable: false, unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role.values(),
    default: Role.NONE,
  })
  role: Role;

  @OneToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'generation' })
  student: Student;
}

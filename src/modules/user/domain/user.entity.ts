import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '@common/model/base-time.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { MemberType } from './member-type';
import { UserStatus } from './user-status';
import { UserRole } from './user-role.entity';

@Entity()
export class User extends BaseTimeEntity {
  constructor();
  constructor(
    name: string,
    email: string,
    memberType: MemberType,
    status: UserStatus,
    generation?: Generation | null,
  );
  constructor(
    name?: string,
    email?: string,
    memberType?: MemberType,
    status?: UserStatus,
    generation?: Generation | null,
  ) {
    super();
    this.name = name;
    this.email = email;
    this.memberType = memberType;
    this.status = status;
    this.generation = generation;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: UserStatus;

  @Column()
  memberType: MemberType;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  role: UserRole[];

  @OneToOne(() => Generation, { nullable: true })
  @JoinColumn({ name: 'generation_number' })
  generation?: Generation;

  static newCandidate(
    email: string,
    memberType: MemberType,
    generation?: Generation | null,
  ): User {
    return new User(null, email, memberType, UserStatus.Candidate, generation);
  }
}

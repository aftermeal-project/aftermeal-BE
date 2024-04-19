import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '@common/entities/base-time.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { MemberType } from './member-type';
import { UserStatus } from './user-status';
import { UserRole } from './user-role.entity';
import { compare, genSalt, hash } from 'bcrypt';

@Entity()
export class User extends BaseTimeEntity {
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

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  role: UserRole[];

  @OneToOne(() => Generation, { nullable: true })
  @JoinColumn({ name: 'generation_number' })
  generation: Generation | null;

  static newCandidate(
    email: string,
    memberType: MemberType,
    generation?: Generation,
  ): User {
    const user: User = new User();
    user.email = email;
    user.memberType = memberType;
    user.generation = generation;
    user.status = UserStatus.Candidate;
    return user;
  }

  static newMember(
    name: string,
    email: string,
    password: string,
    memberType: MemberType,
    generation?: Generation,
  ): User {
    if (memberType === MemberType.Student && !generation) {
      throw Error('generation must be provided');
    }
    const user: User = new User();
    user.name = name;
    user.email = email;
    user.memberType = memberType;
    user.password = password;
    user.status = UserStatus.Activate;
    user.generation = generation;
    return user;
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(this.password, salt);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await compare(plainPassword, this.password);
  }
}

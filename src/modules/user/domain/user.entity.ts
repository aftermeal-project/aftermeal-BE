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
import { UserRole } from './user-role.entity';

@Entity()
export class User extends BaseTimeEntity {
<<<<<<< Updated upstream
=======
  constructor();
  constructor(
    name: string,
    email: string,
    password: string,
    memberType: MemberType,
    status: UserStatus,
    generation: Generation | null,
  );
  constructor(
    name?: string,
    email?: string,
    password?: string,
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

>>>>>>> Stashed changes
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  type: string;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  role: UserRole[];

  @OneToOne(() => Generation)
  @JoinColumn({ name: 'generation_number' })
<<<<<<< Updated upstream
  generation: Generation;
=======
  generation?: Generation;

  static newCandidate(
    email: string,
    memberType: MemberType,
    generation: Generation | null,
  ): User {
    return new User(
      null,
      email,
      null,
      memberType,
      UserStatus.Candidate,
      generation,
    );
  }

  static newMember(
    name: string,
    email: string,
    password: string,
    memberType: MemberType,
    generation: Generation | null,
  ): User {
    return new User(
      name,
      email,
      password,
      memberType,
      UserStatus.Activate,
      generation,
    );
  }
>>>>>>> Stashed changes
}

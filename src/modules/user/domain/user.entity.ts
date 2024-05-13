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
import { EUserType } from './user-type';
import { UserStatus } from './user-status';
import { UserRole } from './user-role.entity';
import { compare, genSalt, hash } from 'bcrypt';
import { Role } from './role.entity';
import { UserTypeTransformer } from './user-type.transformer';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: UserStatus;

  @Column({
    type: 'varchar',
    transformer: new UserTypeTransformer(),
  })
  type: EUserType;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToOne(() => Generation, { nullable: true })
  @JoinColumn({ name: 'generation_number' })
  generation: Generation | null;

  static create(
    name: string,
    email: string,
    type: EUserType,
    role: Role,
    status: UserStatus,
    password: string,
    generation?: Generation,
  ): User {
    const user: User = new User();
    user.name = name;
    user.email = email;
    user.type = type;
    user.userRoles = [UserRole.create(role, user)];
    user.status = status;
    user.password = password;
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

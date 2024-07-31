import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { UserType } from './user-type';
import { UserStatus } from './user-status';
import { UserRole } from '../../role/domain/user-role.entity';
import { compare, genSalt, hash } from 'bcrypt';
import { Role } from '../../role/domain/role.entity';
import { ESchool } from './school';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { isStrongPassword } from 'class-validator';

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

  @Column({ type: 'varchar' })
  userType: UserType;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @ManyToOne(() => Generation, { nullable: true })
  @JoinColumn({ name: 'generation_number' })
  generation: Generation | null;

  static create(
    name: string,
    email: string,
    userType: UserType,
    role: Role,
    status: UserStatus,
    password: string,
    generation: Generation | null = null,
  ): User {
    if (name.length > 40) {
      throw new IllegalArgumentException('이름은 40자 이하여야 합니다.');
    }
    if (password.length > 20) {
      throw new IllegalArgumentException('비밀번호는 20자 이하여야 합니다.');
    }
    if (!isStrongPassword(password)) {
      throw new IllegalArgumentException(
        '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.',
      );
    }
    if (userType === UserType.STUDENT) {
      if (!generation) {
        throw new IllegalArgumentException('학생은 기수가 존재해야 합니다.');
      }
      if (!ESchool.GSM.emailFormat.test(email)) {
        throw new IllegalArgumentException(
          '학생은 학교 이메일을 사용해야 합니다.',
        );
      }
      if (generation.isGraduated) {
        throw new IllegalArgumentException('졸업한 기수는 가입할 수 없습니다.');
      }
    }
    const user: User = new User();
    user.name = name;
    user.email = email;
    user.userType = userType;
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
    const isPasswordCorrect = await compare(plainPassword, this.password);
    if (!isPasswordCorrect) {
      throw new IllegalArgumentException('비밀번호가 올바르지 않습니다.');
    }
    return isPasswordCorrect;
  }
}

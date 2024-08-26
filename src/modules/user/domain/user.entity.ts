import {
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
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: UserStatus;

  @Column({ type: 'varchar' })
  type: UserType;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @ManyToOne(() => Generation, { nullable: true })
  @JoinColumn({
    name: 'generation_number',
    foreignKeyConstraintName: 'fk_user_generation',
  })
  generation: Generation | null;

  static createTeacher(
    name: string,
    email: string,
    role: Role,
    password: string,
  ): User {
    this.validateName(name);
    this.validatePassword(password);

    const user: User = new User();
    user.uuid = uuidv4();
    user.name = name;
    user.email = email;
    user.type = UserType.TEACHER;
    user.userRoles = [UserRole.create(role, user)];
    user.status = UserStatus.ACTIVATE;
    user.password = password;
    return user;
  }

  static createStudent(
    name: string,
    schoolEmail: string,
    role: Role,
    generation: Generation,
    password: string,
  ): User {
    this.validateName(name);
    this.validatePassword(password);
    this.validateGeneration(generation);
    this.validateSchoolEmail(schoolEmail);

    const user: User = new User();
    user.uuid = uuidv4();
    user.name = name;
    user.email = schoolEmail;
    user.type = UserType.STUDENT;
    user.userRoles = [UserRole.create(role, user)];
    user.status = UserStatus.ACTIVATE;
    user.password = password;
    user.generation = generation;
    return user;
  }

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

  private static validateName(name: string): void {
    if (name.length > 40) {
      throw new IllegalArgumentException('이름은 40자 이하여야 합니다.');
    }
  }

  private static validatePassword(password: string): void {
    if (password.length > 20) {
      throw new IllegalArgumentException('비밀번호는 20자 이하여야 합니다.');
    }
    if (!isStrongPassword(password)) {
      throw new IllegalArgumentException(
        '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.',
      );
    }
  }

  private static validateSchoolEmail(schoolEmail: string) {
    if (!ESchool.GSM.emailFormat.test(schoolEmail)) {
      throw new IllegalArgumentException(
        '학생은 학교 이메일을 사용해야 합니다.',
      );
    }
  }

  private static validateGeneration(generation: Generation) {
    if (!generation) {
      throw new IllegalArgumentException('기수가 존재해야 합니다.');
    }
    if (generation.isGraduated) {
      throw new IllegalArgumentException('재학 중인 학생이어야 합니다.');
    }
  }
}

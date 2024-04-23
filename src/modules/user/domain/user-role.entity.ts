import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';
import { BaseTimeEntity } from '@common/entities/base-time.entity';

@Entity()
export class UserRole extends BaseTimeEntity {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static create(role: Role, user: User): UserRole {
    const userRole: UserRole = new UserRole();
    userRole.role = role;
    userRole.user = user;
    return userRole;
  }
}

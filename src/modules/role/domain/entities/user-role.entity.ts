import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { BaseTimeEntity } from '@common/models/base-time.entity';

@Entity()
export class UserRole extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'fk_user_role_role',
  })
  role: Role;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_user_role_user',
  })
  user: User;

  static create(role: Role, user: User): UserRole {
    const userRole: UserRole = new UserRole();
    userRole.role = role;
    userRole.user = user;
    return userRole;
  }
}

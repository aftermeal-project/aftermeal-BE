import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

export class UserRole {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Role, (role) => role.userRole, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User, (user) => user.userRole, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

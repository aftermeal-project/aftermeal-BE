import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

export class UserRole {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

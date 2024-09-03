import { UserRole } from '../entities/user-role.entity';

export interface UserRoleRepository {
  findByUserId(userId: number): Promise<UserRole[]>;
}

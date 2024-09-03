import { Role } from '../entities/role.entity';

export interface RoleRepository {
  findOneByName(name: string): Promise<Role>;
  save(role: Role): Promise<void>;
}

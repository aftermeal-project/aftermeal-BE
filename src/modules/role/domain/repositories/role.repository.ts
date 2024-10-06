import { Role } from '../entities/role.entity';
import { RoleNameType } from '@common/decorators/roles.decorator';

export interface RoleRepository {
  findOneByName(name: RoleNameType): Promise<Role>;
  save(role: Role): Promise<void>;
  deleteAll(): Promise<void>;
}

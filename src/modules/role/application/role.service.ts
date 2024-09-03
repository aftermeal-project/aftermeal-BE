import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../domain/entities/role.entity';
import { UserRole } from '../domain/entities/user-role.entity';
import {
  ROLE_REPOSITORY,
  USER_ROLE_REPOSITORY,
} from '@common/constants/dependency-token';
import { RoleRepository } from '../domain/repositories/role.repository';
import { UserRoleRepository } from '../domain/repositories/user-role.repository';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
    @Inject(USER_ROLE_REPOSITORY)
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async getRoleByRoleName(roleName: string): Promise<Role> {
    let role: Role | undefined =
      await this.roleRepository.findOneByName(roleName);

    if (!role) {
      role = Role.create(roleName);
      await this.roleRepository.save(role);
    }

    return role;
  }

  async getRolesByUserId(userId: number): Promise<Role[]> {
    const userRoles: UserRole[] =
      await this.userRoleRepository.findByUserId(userId);
    return userRoles.map((userRole: UserRole) => userRole.role);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import { ROLE_REPOSITORY } from '@common/constants/dependency-token';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { RoleNameType } from '@common/decorators/roles.decorator';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,
  ) {}

  async getRoleByRoleName(roleName: RoleNameType): Promise<Role> {
    const role: Role | null = await this.roleRepository.findOneByName(roleName);
    if (!role) {
      throw new NotFoundException(`Role with name ${roleName} not found`);
    }
    return role;
  }
}

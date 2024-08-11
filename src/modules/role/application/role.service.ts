import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../domain/role.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../domain/user-role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async getRoleByRoleName(roleName: string): Promise<Role> {
    let role: Role | undefined = await this.roleRepository.findOneBy({
      name: roleName,
    });

    if (!role) {
      role = this.roleRepository.create({ name: roleName });
      await this.roleRepository.save(role);
    }

    return role;
  }

  async getRolesByUserId(userId: number): Promise<Role[]> {
    const userRoles: UserRole[] = await this.userRoleRepository.find({
      where: {
        userId: userId,
      },
      relations: ['role'],
    });
    return userRoles.map((userRole: UserRole) => userRole.role);
  }
}

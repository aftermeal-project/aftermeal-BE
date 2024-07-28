import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../domain/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getOneByName(name: string): Promise<Role> {
    let role: Role | undefined = await this.roleRepository.findOneBy({
      name: name,
    });
    if (!role) {
      role = this.roleRepository.create({ name: name });
      await this.roleRepository.save(role);
    }
    return role;
  }
}

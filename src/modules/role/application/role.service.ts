import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../user/domain/role.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@common/exceptions/not-found.exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getOneByName(name: string): Promise<Role> {
    const role: Role | undefined = await this.roleRepository.findOneBy({
      name: name,
    });
    if (!role) {
      throw new NotFoundException('존재하지 않는 권한입니다.');
    }
    return role;
  }
}

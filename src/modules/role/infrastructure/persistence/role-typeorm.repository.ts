import { RoleRepository } from '../../domain/repositories/role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../domain/entities/role.entity';
import { Repository } from 'typeorm';

export class RoleTypeormRepository implements RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async findOneById(id: number): Promise<Role> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findOneByName(name: string): Promise<Role> {
    return await this.repository.findOne({ where: { name: name } });
  }

  async save(role: Role): Promise<void> {
    await this.repository.save(role);
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}

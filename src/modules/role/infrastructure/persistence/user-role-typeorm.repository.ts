import { UserRoleRepository } from '../../domain/repositories/user-role.repository';
import { Repository } from 'typeorm';
import { UserRole } from '../../domain/entities/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRoleTypeormRepository implements UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repository: Repository<UserRole>,
  ) {}

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }

  async find(): Promise<UserRole[]> {
    return this.repository.find();
  }

  async findByUserId(userId: number): Promise<UserRole[]> {
    return this.repository.findBy({ userId: userId });
  }
}

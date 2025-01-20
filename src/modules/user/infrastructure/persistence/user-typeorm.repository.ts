import { UserRepository } from '../../domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Repository } from 'typeorm';

export class UserTypeormRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async findOneByUuid(uuid: string): Promise<User> {
    return await this.userRepository.findOneBy({ uuid: uuid });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email: email });
  }

  async delete(user: User): Promise<void> {
    await this.userRepository.delete({ id: user.id });
  }

  async deleteAll(): Promise<void> {
    await this.userRepository.delete({});
  }

  async save(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async saveAll(users: User[]): Promise<void> {
    await this.userRepository.save(users);
  }
}

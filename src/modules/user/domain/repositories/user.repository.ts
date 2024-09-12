import { User } from '../entities/user.entity';

export interface UserRepository {
  findOneById(id: number): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  deleteAll(): Promise<void>;
  save(user: User): Promise<void>;
  saveAll(users: User[]): Promise<void>;
}

import { User } from '../entities/user.entity';

export interface UserRepository {
  findOneById(id: number): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
  find(): Promise<User[]>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  saveAll(users: User[]): Promise<void>;
  delete(user: User): any;
  deleteAll(): Promise<void>;
}

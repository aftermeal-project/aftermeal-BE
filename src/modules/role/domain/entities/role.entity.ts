import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';

@Entity()
export class Role extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  static create(name: string): Role {
    const role: Role = new Role();
    role.name = name;
    return role;
  }
}

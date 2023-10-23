import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('code')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authority: string;

  @Column()
  version: number;

  @ManyToOne(() => UserRole)
  userRole: UserRole;
}

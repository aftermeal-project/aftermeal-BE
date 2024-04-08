import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/entities/base-time.entity';

@Entity()
export class Generation extends BaseTimeEntity {
  @PrimaryColumn()
  generationNumber: number;

  @Column({ unique: true })
  yearOfAdmission: number;

  @Column()
  isGraduated: boolean;
}

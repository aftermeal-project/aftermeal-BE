import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';

@Entity()
export class Student extends BaseTimeEntity {
  @PrimaryColumn({ name: 'generation' })
  generation: number;

  @Column({ name: 'student_number', unique: true, default: null })
  studentNumber: number;
}

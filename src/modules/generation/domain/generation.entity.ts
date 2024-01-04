import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/model/base-time.entity';

@Entity()
export class Generation extends BaseTimeEntity {
  @PrimaryColumn({ name: 'generation_number' })
  generationNumber: number;

  @Column({ unique: true })
  yearOfAdmission: number;

  @Column()
  graduated: boolean;
}

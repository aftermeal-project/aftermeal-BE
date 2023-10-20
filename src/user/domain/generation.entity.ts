import { Column, Entity, PrimaryColumn } from 'typeorm';
import { GenerationStatus } from './generation-status';

@Entity()
export class Generation {
  @PrimaryColumn({ name: 'generation' })
  generation: number;

  @Column({ name: 'year_of_admission', unique: true })
  yearOfAdmission: number;

  @Column({ name: 'status', type: 'enum' })
  status: GenerationStatus;
}

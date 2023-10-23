import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Generation {
  @PrimaryColumn({ name: 'generation' })
  generation: number;

  @Column({ name: 'year_of_admission', unique: true })
  yearOfAdmission: number;

  @Column({ name: 'graduated' })
  graduated: boolean;
}

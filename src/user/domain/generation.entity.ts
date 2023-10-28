import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Generation {
  @PrimaryColumn()
  generationNumber: number;

  @Column({ unique: true })
  yearOfAdmission: number;

  @Column()
  graduated: boolean;
}

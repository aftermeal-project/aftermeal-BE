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

  static create(
    generationNumber: number,
    yearOfAdmission: number,
    isGraduated: boolean,
  ): Generation {
    const generation: Generation = new Generation();
    generation.generationNumber = generationNumber;
    generation.yearOfAdmission = yearOfAdmission;
    generation.isGraduated = isGraduated;
    return generation;
  }
}

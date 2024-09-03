import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActivityLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  static create(name: string): ActivityLocation {
    const location = new ActivityLocation();
    location.name = name;
    return location;
  }

  updateName(name: string) {
    this.name = name;
  }
}

import { ParticipationRepository } from '../../domain/repositories/participation.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Participation } from '../../domain/entities/participation.entity';
import { Repository } from 'typeorm';

export class ParticipationTypeormRepository implements ParticipationRepository {
  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
  ) {}

  async find(): Promise<Participation[]> {
    return await this.repository.find();
  }

  async findOneById(id: number): Promise<Participation> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findOneByUserIdAndActivityId(
    userId: number,
    activityId: number,
  ): Promise<Participation> {
    return await this.repository.findOne({
      where: { user: { id: userId }, activity: { id: activityId } },
    });
  }

  async save(participation: Participation): Promise<void> {
    await this.repository.save(participation);
  }

  async saveAll(participations: Participation[]): Promise<void> {
    await this.repository.save(participations);
  }

  async delete(participation: Participation): Promise<void> {
    await this.repository.delete({
      id: participation.id,
    });
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}

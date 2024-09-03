import { ParticipationRepository } from '../entities/participation.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Participation } from '../entities/participation.entity';
import { Repository } from 'typeorm';

export class ParticipationTypeormRepository implements ParticipationRepository {
  constructor(
    @InjectRepository(Participation)
    private readonly repository: Repository<Participation>,
  ) {}

  async findOneById(id: number): Promise<Participation> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findByUserIdAndActivityId(
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

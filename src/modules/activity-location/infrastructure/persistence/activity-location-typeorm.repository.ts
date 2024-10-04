import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityLocation } from '../../domain/entities/activity-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLocationRepository } from '../../domain/repositories/activity-location.repository';

@Injectable()
export class ActivityLocationTypeormRepository
  implements ActivityLocationRepository
{
  constructor(
    @InjectRepository(ActivityLocation)
    private readonly repository: Repository<ActivityLocation>,
  ) {}

  async find(): Promise<ActivityLocation[]> {
    return await this.repository.find();
  }

  async findOneById(id: number): Promise<ActivityLocation> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findOneByName(name: string): Promise<ActivityLocation> {
    return await this.repository.findOne({ where: { name: name } });
  }

  async save(activityLocation: ActivityLocation): Promise<void> {
    await this.repository.save(activityLocation);
  }

  async saveAll(activityLocations: ActivityLocation[]): Promise<void> {
    await this.repository.save(activityLocations);
  }

  async delete(activityLocation: ActivityLocation): Promise<void> {
    await this.repository.remove(activityLocation);
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}

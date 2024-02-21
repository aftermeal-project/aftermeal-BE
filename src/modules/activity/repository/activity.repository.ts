import { DataSource, Repository } from 'typeorm';
import { Activity } from '../domain/activity.entity';
import { ActivityRepoDto } from '../dto/activity.repo.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(private readonly dataSource: DataSource) {
    super(Activity, dataSource.manager);
  }

  async findActivitiesWithParticipantCounts(): Promise<ActivityRepoDto[]> {
    return await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.participation', 'participation')
      .select('activity.id', 'id')
      .addSelect('activity.name', 'name')
      .addSelect('activity.maximumParticipants', 'maximumParticipants')
      .addSelect('COUNT(participation.id)', 'participantsCount')
      .groupBy('activity.id')
      .getRawMany();
  }
}

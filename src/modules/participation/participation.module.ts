import { Module } from '@nestjs/common';
import { ParticipationService } from './application/services/participation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './domain/entities/participation.entity';
import {
  ACTIVITY_REPOSITORY,
  PARTICIPATION_REPOSITORY,
  TIME,
} from '@common/constants/dependency-token';
import { ParticipationTypeormRepository } from './infrastructure/persistence/participation-typeorm.repository';
import { ParticipationController } from './presentation/controllers/participation.controller';
import { JodaTime } from '@common/time/joda-time';
import { ActivityTypeormRepository } from '../activity/infrastructure/persistence/activity-typeorm.repository';
import { Activity } from '../activity/domain/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participation, Activity])],
  controllers: [ParticipationController],
  providers: [
    ParticipationService,
    {
      provide: PARTICIPATION_REPOSITORY,
      useClass: ParticipationTypeormRepository,
    },
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityTypeormRepository,
    },
    {
      provide: TIME,
      useClass: JodaTime,
    },
  ],
})
export class ParticipationModule {}

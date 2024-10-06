import { Module } from '@nestjs/common';
import { ParticipationService } from './application/services/participation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './domain/entities/participation.entity';
import {
  PARTICIPATION_REPOSITORY,
  TIME,
} from '@common/constants/dependency-token';
import { ParticipationTypeormRepository } from './infrastructure/persistence/participation-typeorm.repository';
import { ParticipationController } from './presentation/controllers/participation.controller';
import { JodaTime } from '@common/time/joda-time';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participation]), ActivityModule],
  controllers: [ParticipationController],
  providers: [
    ParticipationService,
    {
      provide: PARTICIPATION_REPOSITORY,
      useClass: ParticipationTypeormRepository,
    },
    {
      provide: TIME,
      useClass: JodaTime,
    },
  ],
})
export class ParticipationModule {}

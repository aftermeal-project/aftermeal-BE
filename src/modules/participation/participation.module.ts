import { Module } from '@nestjs/common';
import { ParticipationController } from './presentation/participation.controller';
import { ParticipationService } from './application/participation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './domain/participation.entity';
import { ActivityService } from '../activity/application/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Participation])],
  controllers: [ParticipationController],
  providers: [ParticipationService, ActivityService],
})
export class ParticipationModule {}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivityService } from './application/activity.service';
import { VoteRepository } from '../vote/repository/vote.repository';
import { ActivityController } from './presentation/activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/activity.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService, VoteRepository],
  exports: [ActivityService],
})
export class ActivityModule {}

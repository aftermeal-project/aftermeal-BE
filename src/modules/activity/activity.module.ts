import { Module } from '@nestjs/common';
import { ActivityScheduleService } from './application/activity-schedule.service';
import { ActivityController } from './presentation/activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/activity.entity';
import { ActivityTypeormRepository } from './infrastructure/activity-item-typeorm.repository';
import {
  ACTIVITY_REPOSITORY,
  ACTIVITY_SCHEDULE_REPOSITORY,
} from '@common/constants';
import { ActivitySchedule } from './domain/activity-schedule.entity';
import { ActivityScheduleTypeormRepository } from './infrastructure/activity-schedule-typeorm.repository';
import { ActivityService } from './application/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitySchedule, Activity])],
  controllers: [ActivityController],
  providers: [
    ActivityScheduleService,
    ActivityService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityTypeormRepository,
    },
    {
      provide: ACTIVITY_SCHEDULE_REPOSITORY,
      useClass: ActivityScheduleTypeormRepository,
    },
  ],
  exports: [ActivityScheduleService],
})
export class ActivityModule {}

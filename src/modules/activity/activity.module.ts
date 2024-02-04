import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivityService } from './application/activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/activity.entity';
import { ActivityDetail } from './domain/activity-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, ActivityDetail]),
    ScheduleModule.forRoot(),
  ],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}

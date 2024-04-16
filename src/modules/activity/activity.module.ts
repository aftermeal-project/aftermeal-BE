import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivityService } from './application/activity.service';
import { ActivityController } from './presentation/activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/activity.entity';
import { Participation } from '../participation/domain/participation.entity';
import { ActivityRepositoryImpl } from './domain/activity.repository-impl';
import { ACTIVITY_REPOSITORY } from '@common/constants';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Activity, Participation]),
  ],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    { provide: ACTIVITY_REPOSITORY, useClass: ActivityRepositoryImpl },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}

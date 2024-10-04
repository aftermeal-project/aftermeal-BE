import { Module } from '@nestjs/common';
import { ActivityService } from './application/services/activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/entities/activity.entity';
import { ACTIVITY_REPOSITORY, TIME } from '@common/constants/dependency-token';
import { ActivityTypeormRepository } from './infrastructure/persistence/activity-typeorm.repository';
import { ActivityController } from './presentation/controllers/activity.controller';
import { ActivityLocationModule } from '../activity-location/activity-location.module';
import { JodaTime } from '@common/time/joda-time';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), ActivityLocationModule],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityTypeormRepository,
    },
    {
      provide: TIME,
      useClass: JodaTime,
    },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}

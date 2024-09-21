import { Module } from '@nestjs/common';
import { ActivityService } from './application/services/activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/entities/activity.entity';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityTypeormRepository } from './infrastructure/persistence/activity-typeorm.repository';
import { ActivityController } from './presentation/controllers/activity.controller';
import { ActivityLocationModule } from '../activity-location/activity-location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), ActivityLocationModule],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityTypeormRepository,
    },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}

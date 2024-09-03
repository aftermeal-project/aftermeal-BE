import { Module } from '@nestjs/common';
import { ActivityService } from './application/activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/entities/activity.entity';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityTypeormRepository } from './infrastructure/persistence/activity-typeorm.repository';
import { ActivityController } from './presentation/controllers/activity.controller';
import { ParticipationModule } from '../participation/participation.module';
import { AdminActivityController } from './presentation/controllers/admin-activity.controller';
import { ActivityLocationModule } from '../activity-location/activity-location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    ParticipationModule,
    ActivityLocationModule,
  ],
  controllers: [ActivityController, AdminActivityController],
  providers: [
    ActivityService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityTypeormRepository,
    },
  ],
})
export class ActivityModule {}

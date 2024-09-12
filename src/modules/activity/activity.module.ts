import { Module } from '@nestjs/common';
import { ActivityService } from './application/services/activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/entities/activity.entity';
import { ACTIVITY_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityTypeormRepository } from './infrastructure/persistence/activity-typeorm.repository';
import { ActivityController } from './presentation/controllers/activity.controller';
import { ActivityAdminController } from './presentation/controllers/activity-admin.controller';
import { ActivityLocationModule } from '../activity-location/activity-location.module';
import { ActivityAdminService } from './application/services/activity-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), ActivityLocationModule],
  controllers: [ActivityController, ActivityAdminController],
  providers: [
    ActivityService,
    ActivityAdminService,
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityTypeormRepository,
    },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}

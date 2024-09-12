import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLocation } from './domain/entities/activity-location.entity';
import { ActivityLocationAdminService } from './application/services/activity-location-admin.service';
import { ACTIVITY_LOCATION_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityLocationTypeormRepository } from './infrastructure/persistence/activity-location-typeorm.repository';
import { ActivityLocationAdminController } from './presentation/controllers/activity-location-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLocation])],
  controllers: [ActivityLocationAdminController],
  providers: [
    ActivityLocationAdminService,
    {
      provide: ACTIVITY_LOCATION_REPOSITORY,
      useClass: ActivityLocationTypeormRepository,
    },
  ],
  exports: [ActivityLocationAdminService],
})
export class ActivityLocationModule {}

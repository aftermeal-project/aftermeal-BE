import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLocation } from './domain/entities/activity-location.entity';
import { ActivityLocationService } from './application/services/activity-location.service';
import { ACTIVITY_LOCATION_REPOSITORY } from '@common/constants/dependency-token';
import { ActivityLocationTypeormRepository } from './infrastructure/persistence/activity-location-typeorm.repository';
import { ActivityLocationController } from './presentation/controllers/activity-location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLocation])],
  controllers: [ActivityLocationController],
  providers: [
    ActivityLocationService,
    {
      provide: ACTIVITY_LOCATION_REPOSITORY,
      useClass: ActivityLocationTypeormRepository,
    },
  ],
  exports: [ActivityLocationService],
})
export class ActivityLocationModule {}

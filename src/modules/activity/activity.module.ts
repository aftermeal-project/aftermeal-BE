import { Module } from '@nestjs/common';
import { ActivityService } from './application/activity.service';
import { ActivityController } from './presentation/activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './domain/activity.entity';
import { ActivityTypeOrmRepository } from './infrastructure/activity-typeorm.repository';
import { ACTIVITY_REPOSITORY } from '@common/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    { provide: ACTIVITY_REPOSITORY, useClass: ActivityTypeOrmRepository },
  ],
  exports: [ActivityService],
})
export class ActivityModule {}

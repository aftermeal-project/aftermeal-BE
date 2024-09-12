import { Module } from '@nestjs/common';
import { ParticipationService } from './application/services/participation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './domain/entities/participation.entity';
import { PARTICIPATION_REPOSITORY } from '@common/constants/dependency-token';
import { ParticipationTypeormRepository } from './domain/repositories/participation-typeorm.repository';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';
import { ParticipationController } from './presentation/controllers/participation.controller';
import { ParticipationAdminController } from './presentation/controllers/participation-admin.controller';
import { ParticipationAdminService } from './application/services/participation-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    ActivityModule,
    UserModule,
  ],
  controllers: [ParticipationController, ParticipationAdminController],
  providers: [
    ParticipationService,
    ParticipationAdminService,
    {
      provide: PARTICIPATION_REPOSITORY,
      useClass: ParticipationTypeormRepository,
    },
  ],
})
export class ParticipationModule {}

import { Module } from '@nestjs/common';
import { ParticipationService } from './application/participation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './domain/entities/participation.entity';
import { PARTICIPATION_REPOSITORY } from '@common/constants/dependency-token';
import { ParticipationTypeormRepository } from './domain/repositories/participation-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Participation])],
  providers: [
    ParticipationService,
    {
      provide: PARTICIPATION_REPOSITORY,
      useClass: ParticipationTypeormRepository,
    },
  ],
  exports: [ParticipationService],
})
export class ParticipationModule {}

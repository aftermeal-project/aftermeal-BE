import { Module } from '@nestjs/common';
import { ParticipationController } from './presentation/participation.controller';
import { ParticipationService } from './application/participation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './domain/participation.entity';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    ActivityModule,
    UserModule,
  ],
  controllers: [ParticipationController],
  providers: [ParticipationService],
})
export class ParticipationModule {}

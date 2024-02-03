import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './domain/vote.entity';
import { VoteController } from './presentation/vote.controller';
import { VoteService } from './application/vote.service';
import { ActivityService } from '../activity/application/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  controllers: [VoteController],
  providers: [VoteService, ActivityService],
})
export class VoteModule {}

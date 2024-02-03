import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './domain/vote.entity';
import { Activity } from '../activity/domain/activity.entity';
import { VoteController } from './presentation/vote.controller';
import { VoteService } from './application/vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Activity])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}

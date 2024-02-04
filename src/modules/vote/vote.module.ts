import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './domain/vote.entity';
import { VoteController } from './presentation/vote.controller';
import { VoteService } from './application/vote.service';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [ActivityModule, TypeOrmModule.forFeature([Vote])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}

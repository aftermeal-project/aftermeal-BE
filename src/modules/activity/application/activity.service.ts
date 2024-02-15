import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity.entity';
import { Cron } from '@nestjs/schedule';
import { VoteRepository } from '../../vote/repository/vote.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalDate } from '@js-joda/core';

enum CronExpression {
  MONDAY_TO_FRIDAY_AT_9AM = '0 0 09 * * 1-5',
  MONDAY_TO_FRIDAY_AT_11AM = '0 0 11 * * 1-5',
}

@Injectable()
export class ActivityService {
  constructor(
    private readonly voteRepository: VoteRepository,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async getActivity(activityId: number): Promise<Activity> {
    const activity: Activity | null = await this.activityRepository.findOneBy({
      id: activityId,
    });
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }
    return activity;
  }

  async getVotingActivities(strDate: string): Promise<Activity[]> {
    return await this.voteRepository.findVotingActivities(strDate);
  }

  // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_11AM)
  // async endVote(): Promise<void> {
  //   const currentDate: Date = new Date();
  //   const activity: Activity = await this.getMostVotedActivity(currentDate);
  //   activity.selected = true;
  //   await this.activityRepository.save(activity).then((activity) => {
  //     Logger.log(`${activity.name} is Select!`);
  //   });
  // }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_9AM)
  async ResetToBeforeVote() {
    const activity: Activity = await this.activityRepository.findOneBy({
      selected: true,
    });
    activity.selected = false;
    await this.activityRepository.save(activity);
  }
}

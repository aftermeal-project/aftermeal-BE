import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../domain/activity.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ActivityDetail } from '../domain/activity-detail.entity';

enum CronExpression {
  MONDAY_TO_FRIDAY_AT_9AM = '0 0 09 * * 1-5',
  MONDAY_TO_FRIDAY_AT_11AM = '0 0 11 * * 1-5',
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(ActivityDetail)
    private readonly activityDetailRepository: Repository<ActivityDetail>,
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

  async getActivityHighestVoted(): Promise<Activity> {
    return await this.activityRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.vote', 'v')
      .select('a.id', 'id')
      .addSelect('a.activity_detail_id', 'activity_detail_id')
      .addSelect('COUNT(v.activity_id)', 'VoteCount')
      .where('v.created_at = CURDATE()')
      .groupBy('a.id')
      .addGroupBy('a.activity_item_id')
      .limit(1)
      .getRawOne();
    // TODO DTO 만들기
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_9AM)
  async startVote(): Promise<void> {
    const activityDetail: ActivityDetail[] =
      await this.activityDetailRepository.find();

    activityDetail.map(
      async (activityDetail: ActivityDetail): Promise<void> => {
        const activity = new Activity();
        activity.activityDetail = activityDetail;
        await this.activityRepository.save(activity);
      },
    );
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_11AM)
  async endVote(): Promise<void> {
    const todayHighestVotedActivity: Activity =
      await this.getActivityHighestVoted();
    todayHighestVotedActivity.selected = true;

    await this.activityRepository.save(todayHighestVotedActivity);
  }
}

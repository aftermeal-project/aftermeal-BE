import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityInfo } from '../domain/activity-info.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../domain/activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(ActivityInfo)
    private readonly activityInfoRepository: Repository<ActivityInfo>,
  ) {}

  async getActivityById(activityId: number): Promise<Activity> {
    const activity: Activity = await this.activityRepository.findOneBy({
      id: activityId,
    });
    if (!activity) {
      throw new NotFoundException('존재하지 않는 활동입니다.');
    }
    return activity;
  }

  async getActivities(): Promise<Activity[]> {
    return await this.activityRepository.find({
      select: {
        activityInfo: {
          name: true,
          maximumParticipants: true,
        },
      },
    });
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_9AM)
  async createActivityToReceivingParticipation() {
    const activitiesInfo: ActivityInfo[] =
      await this.activityInfoRepository.find();

    for (const activityInfo of activitiesInfo) {
      const activity: Activity = new Activity();
      activity.activityInfo = activityInfo;
      await this.activityRepository.save(activity);
    }
  }
}

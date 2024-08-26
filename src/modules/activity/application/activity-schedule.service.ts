import { Inject, Injectable } from '@nestjs/common';
import { ActivityScheduleRepository } from '../domain/activity-schedule.repository';
import { ACTIVITY_SCHEDULE_REPOSITORY } from '@common/constants';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { ActivityScheduleSummaryDto } from '../infrastructure/dto/activity-schedule-summary.dto';
import { ActivityScheduleSummaryResponseDto } from '../presentation/dto/activity-schedule-summary-response.dto';
import { ActivitySchedule } from '../domain/activity-schedule.entity';

@Injectable()
export class ActivityScheduleService {
  constructor(
    @Inject(ACTIVITY_SCHEDULE_REPOSITORY)
    private readonly activityScheduleRepository: ActivityScheduleRepository,
  ) {}

  async getActivityScheduleById(id: number): Promise<ActivitySchedule> {
    const activitySchedule: ActivitySchedule =
      await this.activityScheduleRepository.findById(id);
    if (!activitySchedule) {
      throw new NotFoundException('존재하지 않는 활동 항목입니다.');
    }
    return activitySchedule;
  }

  async getActivityScheduleSummaries(): Promise<
    ActivityScheduleSummaryResponseDto[]
  > {
    const summaryDtos: ActivityScheduleSummaryDto[] =
      await this.activityScheduleRepository.findActivitySummaries();
    return summaryDtos.map((activity) =>
      ActivityScheduleSummaryResponseDto.from(activity),
    );
  }
}

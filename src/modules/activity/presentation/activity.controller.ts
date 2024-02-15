import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { ActivityService } from '../application/activity.service';
import { ResponseEntity } from '@common/model/response.entity';
import { Public } from '@common/decorator/public.decorator';
import { LocalDate } from '@js-joda/core';

@Controller('v1/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get('voting')
  async getVotingActivities(
    @Query('date', new DefaultValuePipe(LocalDate.now().toString()))
    strDate: string, // TODO(validate YYYY-MM-DD format)
  ) {
    return ResponseEntity.OK_WITH_DATA(
      '활동 투표 전체 조회에 성공했습니다.',
      await this.activityService.getVotingActivities(strDate),
    );
  }
}

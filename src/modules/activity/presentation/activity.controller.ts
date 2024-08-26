import { Controller, Get } from '@nestjs/common';
import { ActivityScheduleService } from '../application/activity-schedule.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivityScheduleSummaryResponseDto } from './dto/activity-schedule-summary-response.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityService } from '../application/activity.service';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(
    private readonly activityScheduleService: ActivityScheduleService,
    private readonly activityservice: ActivityService,
  ) {}

  @Public()
  @Get('summary')
  @ApiOperation({ summary: '활동 일정 요약 목록 조회' })
  @ApiOkResponse({
    description: 'OK',
    type: ActivityScheduleSummaryResponseDto,
    isArray: true,
  })
  async getActivityScheduleSummaries(): Promise<
    ResponseEntity<ActivityScheduleSummaryResponseDto[]>
  > {
    return ResponseEntity.OK_WITH_DATA(
      '활동 요약 목록 조회에 성공하였습니다.',
      await this.activityScheduleService.getActivityScheduleSummaries(),
    );
  }

  @Public()
  @Get()
  @ApiOperation({ summary: '활동 목록 조회' })
  @ApiOkResponse({
    description: 'OK',
    type: ActivityResponseDto,
    isArray: true,
  })
  async getActivities(): Promise<ResponseEntity<ActivityResponseDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '활동 목록 조회에 성공하였습니다.',
      await this.activityservice.getActivities(),
    );
  }
}

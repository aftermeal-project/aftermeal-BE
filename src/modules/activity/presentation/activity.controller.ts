import { Controller, Get } from '@nestjs/common';
import { ActivityService } from '../application/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivitySummaryResponseDto } from './dto/activity-summary-response.dto';
import { ActivityInfoResponseDto } from './dto/activity-info-response.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '활동 요약 목록 조회' })
  @ApiOkResponse({
    description: 'OK',
    type: ActivitySummaryResponseDto,
    isArray: true,
  })
  async getActivitySummaries(): Promise<
    ResponseEntity<ActivitySummaryResponseDto[]>
  > {
    return ResponseEntity.OK_WITH_DATA(
      '활동 요약 목록 조회에 성공하였습니다.',
      await this.activityService.getActivitySummaries(),
    );
  }

  @Public()
  @Get('info')
  @ApiOperation({ summary: '활동 정보 목록 조회' })
  @ApiOkResponse({
    description: 'OK',
    type: ActivityInfoResponseDto,
    isArray: true,
  })
  async getActivityInfos(): Promise<ResponseEntity<ActivityInfoResponseDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '활동 정보 목록 조회에 성공하였습니다.',
      await this.activityService.getActivityInfos(),
    );
  }
}

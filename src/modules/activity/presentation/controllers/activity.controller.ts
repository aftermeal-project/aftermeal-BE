import { Controller, Get, Param } from '@nestjs/common';
import { ActivityService } from '../../application/services/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivityListResponseDto } from '../dto/activity-list-response.dto';
import { ActivityDetailResponseDto } from '../dto/activity-detail-response.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  async getActivityList(): Promise<ResponseEntity<ActivityListResponseDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '활동 일정 목록 조회에 성공하였습니다.',
      await this.activityService.getActivityList(),
    );
  }

  @Public()
  @Get(':activityId')
  async getActivityDetails(
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<ActivityDetailResponseDto>> {
    const activityDetailResponseDto: ActivityDetailResponseDto =
      await this.activityService.getActivityDetails(activityId);
    return ResponseEntity.OK_WITH_DATA(
      '활동 상세 조회에 성공하였습니다.',
      activityDetailResponseDto,
    );
  }
}

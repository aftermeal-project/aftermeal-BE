import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ActivityService } from '../../application/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivityResponseDto } from '../dto/activity-response.dto';
import { ActivityDetailResponseDto } from '../dto/activity-detail-response.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '../../../user/domain/entities/user.entity';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  async getActivityList(): Promise<ResponseEntity<ActivityResponseDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '활동 일정 목록 조회에 성공하였습니다.',
      await this.activityService.getActivityList(),
    );
  }

  @Public()
  @Get(':id')
  async getActivityDetails(
    @Param('id') activityId: number,
  ): Promise<ResponseEntity<ActivityDetailResponseDto>> {
    const activityDetailResponseDto: ActivityDetailResponseDto =
      await this.activityService.getActivityDetails(activityId);
    return ResponseEntity.OK_WITH_DATA(
      '활동 상세 조회에 성공하였습니다.',
      activityDetailResponseDto,
    );
  }

  @Post(':id/joins')
  async participate(
    @Param('id') activityId: number,
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.participate(activityId, user);
    return ResponseEntity.OK('활동 참여에 성공하였습니다.');
  }

  @Delete(':id/joins/:joinId')
  async cancelActivityJoin(
    @Param('id') activityId: number,
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.cancelActivityJoin(activityId, user);
    return ResponseEntity.OK('활동 참여 취소에 성공하였습니다.');
  }
}

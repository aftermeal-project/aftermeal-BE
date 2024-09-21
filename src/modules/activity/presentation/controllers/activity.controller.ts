import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityService } from '../../application/services/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivitySummaryResponseDto } from '../dto/activity-summary-response.dto';
import { ActivityDetailResponseDto } from '../dto/activity-detail-response.dto';
import { ActivityCreationRequestDto } from '../dto/activity-creation-request.dto';
import { ActivityUpdateRequestDto } from '../dto/activity-update-request.dto';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Roles('ADMIN')
  @Post()
  async createActivity(
    @Body() dto: ActivityCreationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.createActivity(dto);
    return ResponseEntity.OK('활동 생성에 성공하였습니다.');
  }

  @Public()
  @Get()
  async getActivities(): Promise<ResponseEntity<ActivitySummaryResponseDto[]>> {
    const activitySummaryResponseDtos: ActivitySummaryResponseDto[] =
      await this.activityService.getActivitySummaries();
    return ResponseEntity.OK_WITH_DATA(
      '활동 목록 조회에 성공하였습니다.',
      activitySummaryResponseDtos,
    );
  }

  @Public()
  @Get(':activityId')
  async getActivityDetailById(
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<ActivityDetailResponseDto>> {
    const activityDetailResponseDto: ActivityDetailResponseDto =
      await this.activityService.getActivityDetailById(activityId);
    return ResponseEntity.OK_WITH_DATA(
      '활동 상세 조회에 성공하였습니다.',
      activityDetailResponseDto,
    );
  }

  @Roles('ADMIN')
  @Patch(':activityId')
  async updateActivity(
    @Body() dto: ActivityUpdateRequestDto,
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.updateActivity(activityId, dto);
    return ResponseEntity.OK('활동 수정에 성공하였습니다.');
  }

  @Roles('ADMIN')
  @Delete(':activityId')
  async deleteActivity(
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.deleteActivity(activityId);
    return ResponseEntity.OK('활동 삭제에 성공하였습니다.');
  }
}

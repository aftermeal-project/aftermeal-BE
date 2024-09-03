import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityService } from '../../application/activity.service';
import { ActivityCreationRequestDto } from '../dto/activity-creation-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { ActivityUpdateRequestDto } from '../dto/activity-update-request.dto';
import { ActivityResponseDto } from '../dto/activity-response.dto';
import { ActivityDetailResponseDto } from '../dto/activity-detail-response.dto';

@Controller('admin/activities')
export class AdminActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async createActivity(
    @Body() dto: ActivityCreationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.createActivity(dto);
    return ResponseEntity.OK('활동 생성에 성공하였습니다.');
  }

  @Get()
  async getActivityList(): Promise<ResponseEntity<ActivityResponseDto[]>> {
    const activities: ActivityResponseDto[] =
      await this.activityService.getActivityList();
    return ResponseEntity.OK_WITH_DATA(
      '활동 목록 조회에 성공하였습니다.',
      activities,
    );
  }

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

  @Patch(':id')
  async updateActivity(
    @Body() dto: ActivityUpdateRequestDto,
    @Param('id') activityId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.updateActivity(activityId, dto);
    return ResponseEntity.OK('활동 수정에 성공하였습니다.');
  }

  @Delete(':id')
  async deleteActivity(
    @Param('id') activityId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.deleteActivity(activityId);
    return ResponseEntity.OK('활동 삭제에 성공하였습니다.');
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityCreationRequestDto } from '../dto/activity-creation-request.dto';
import { ResponseEntity } from '@common/models/response.entity';
import { ActivityUpdateRequestDto } from '../dto/activity-update-request.dto';
import { ActivityDetailResponseDto } from '../dto/activity-detail-response.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { ActivityAdminService } from '../../application/services/activity-admin.service';
import { ActivityAdminResponseDto } from '../dto/activity-admin-response.dto';

@Roles('ADMIN')
@Controller('admin/activities')
export class ActivityAdminController {
  constructor(private readonly activityService: ActivityAdminService) {}

  @Post()
  async createActivity(
    @Body() dto: ActivityCreationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.createActivity(dto);
    return ResponseEntity.OK('활동 생성에 성공하였습니다.');
  }

  @Get()
  async getAllActivities(): Promise<
    ResponseEntity<ActivityAdminResponseDto[]>
  > {
    const activities: ActivityAdminResponseDto[] =
      await this.activityService.getAllActivities();
    return ResponseEntity.OK_WITH_DATA(
      '활동 목록 조회에 성공하였습니다.',
      activities,
    );
  }

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

  @Patch(':activityId')
  async updateActivity(
    @Body() dto: ActivityUpdateRequestDto,
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.updateActivity(activityId, dto);
    return ResponseEntity.OK('활동 수정에 성공하였습니다.');
  }

  @Delete(':activityId')
  async deleteActivity(
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityService.deleteActivity(activityId);
    return ResponseEntity.OK('활동 삭제에 성공하였습니다.');
  }
}

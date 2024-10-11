import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  ): Promise<ResponseEntity<null>> {
    await this.activityService.createActivity(dto);
    return ResponseEntity.SUCCESS();
  }

  @Public()
  @Get()
  async getActivities(): Promise<ResponseEntity<ActivitySummaryResponseDto[]>> {
    const activitySummaryResponseDtos: ActivitySummaryResponseDto[] =
      await this.activityService.getActivitySummaries();
    return ResponseEntity.SUCCESS(activitySummaryResponseDtos);
  }

  @Public()
  @Get(':activityId')
  async getActivityDetailById(
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<ActivityDetailResponseDto>> {
    const activityDetailResponseDto: ActivityDetailResponseDto =
      await this.activityService.getActivityDetailById(activityId);
    return ResponseEntity.SUCCESS(activityDetailResponseDto);
  }

  @Roles('ADMIN')
  @Patch(':activityId')
  @HttpCode(204)
  async updateActivity(
    @Body() dto: ActivityUpdateRequestDto,
    @Param('activityId') activityId: number,
  ): Promise<void> {
    await this.activityService.updateActivity(activityId, dto);
  }

  @Roles('ADMIN')
  @Delete(':activityId')
  @HttpCode(204)
  async deleteActivity(@Param('activityId') activityId: number): Promise<void> {
    await this.activityService.deleteActivity(activityId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ActivityService } from '../../application/services/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivityListResponseDto } from '../dto/activity-list-response.dto';
import { ActivityResponseDto } from '../dto/activity-response.dto';
import { ActivityCreationRequestDto } from '../dto/activity-creation-request.dto';
import { ActivityUpdateRequestDto } from '../dto/activity-update-request.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { LocalDate } from '@js-joda/core';
import { ActivityQueryDto } from '../dto/activity-query.dto';

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
  async getActivities(
    @Query() query: ActivityQueryDto,
  ): Promise<ResponseEntity<ActivityListResponseDto[]>> {
    if (!query.date) {
      query.date = LocalDate.now();
    }

    const responseDtos: ActivityListResponseDto[] =
      await this.activityService.getActivityListResponseByDate(query);
    return ResponseEntity.SUCCESS(responseDtos);
  }

  @Public()
  @Get(':activityId')
  async getActivityById(
    @Param('activityId') activityId: number,
  ): Promise<ResponseEntity<ActivityResponseDto>> {
    const responseDto: ActivityResponseDto =
      await this.activityService.getActivityResponseById(activityId);
    return ResponseEntity.SUCCESS(responseDto);
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponseEntity } from '@common/models/response.entity';
import { ActivityLocationAdminService } from '../../application/services/activity-location-admin.service';
import { ActivityLocationResponseDto } from '../dto/activity-location-response.dto';
import { ActivityLocationUpdateRequestDto } from '../dto/activity-location-update-request.dto';
import { ActivityLocationCreationRequestDto } from '../dto/activity-location-creation-request.dto';
import { Roles } from '@common/decorators/roles.decorator';

@Roles('ADMIN')
@Controller('admin/activity-locations')
export class ActivityLocationAdminController {
  constructor(
    private readonly activityLocationService: ActivityLocationAdminService,
  ) {}

  @Post()
  async createActivityLocation(
    @Body() dto: ActivityLocationCreationRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.activityLocationService.createActivityLocation(dto);
    return ResponseEntity.OK('활동 장소 생성에 성공하였습니다.');
  }

  @Get()
  async getActivityLocations(): Promise<
    ResponseEntity<ActivityLocationResponseDto[]>
  > {
    return ResponseEntity.OK_WITH_DATA(
      '활동 장소 목록 조회에 성공하였습니다.',
      await this.activityLocationService.getActivityLocations(),
    );
  }

  @Patch(':activityLocationId')
  async updateActivityLocation(
    @Param('activityLocationId') activityLocationId: number,
    @Body() dto: ActivityLocationUpdateRequestDto,
  ): Promise<ResponseEntity<void>> {
    await this.activityLocationService.updateActivityLocation(
      activityLocationId,
      dto,
    );
    return ResponseEntity.OK('활동 장소 수정에 성공하였습니다.');
  }

  @Delete(':activityLocationId')
  async deleteActivityLocation(
    @Param('activityLocationId') activityLocationId: number,
  ): Promise<ResponseEntity<void>> {
    await this.activityLocationService.deleteActivityLocation(
      activityLocationId,
    );
    return ResponseEntity.OK('활동 장소 삭제에 성공하였습니다.');
  }
}

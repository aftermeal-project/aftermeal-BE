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
import { ResponseEntity } from '@common/models/response.entity';
import { ActivityLocationService } from '../../application/services/activity-location.service';
import { ActivityLocationResponseDto } from '../dto/activity-location-response.dto';
import { ActivityLocationUpdateRequestDto } from '../dto/activity-location-update-request.dto';
import { ActivityLocationCreationRequestDto } from '../dto/activity-location-creation-request.dto';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('activity-locations')
export class ActivityLocationController {
  constructor(
    private readonly activityLocationService: ActivityLocationService,
  ) {}

  @Roles('ADMIN')
  @Post()
  async createActivityLocation(
    @Body() dto: ActivityLocationCreationRequestDto,
  ): Promise<ResponseEntity<null>> {
    await this.activityLocationService.createActivityLocation(dto);
    return ResponseEntity.SUCCESS();
  }

  @Roles('ADMIN')
  @Get()
  async getActivityLocations(): Promise<
    ResponseEntity<ActivityLocationResponseDto[]>
  > {
    return ResponseEntity.SUCCESS_WITH_DATA(
      await this.activityLocationService.getActivityLocations(),
    );
  }

  @Roles('ADMIN')
  @Patch(':activityLocationId')
  @HttpCode(204)
  async updateActivityLocation(
    @Param('activityLocationId') activityLocationId: number,
    @Body() dto: ActivityLocationUpdateRequestDto,
  ): Promise<void> {
    await this.activityLocationService.updateActivityLocation(
      activityLocationId,
      dto,
    );
  }

  @Roles('ADMIN')
  @Delete(':activityLocationId')
  @HttpCode(204)
  async deleteActivityLocation(
    @Param('activityLocationId') activityLocationId: number,
  ): Promise<void> {
    await this.activityLocationService.deleteActivityLocation(
      activityLocationId,
    );
  }
}

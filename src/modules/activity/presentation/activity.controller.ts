import { Controller, Get } from '@nestjs/common';
import { ActivityService } from '../application/activity.service';
import { ResponseEntity } from '@common/model/response.entity';
import { Public } from '@common/decorator/public.decorator';
import { ActivityDto } from '../dto/activity.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  async getActivities(): Promise<ResponseEntity<ActivityDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '활동 전체 조회에 성공하였습니다.',
      await this.activityService.getActivities(),
    );
  }
}

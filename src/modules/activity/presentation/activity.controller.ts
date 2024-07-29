import { Controller, Get } from '@nestjs/common';
import { ActivityService } from '../application/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivityResDto } from './dto/activity.res.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  async getActivities(): Promise<ResponseEntity<ActivityResDto[]>> {
    return ResponseEntity.OK_WITH_DATA(
      '활동 목록 조회에 성공하였습니다.',
      await this.activityService.getAll(),
    );
  }
}

import { Controller, Get } from '@nestjs/common';
import { ActivityService } from '../application/activity.service';
import { ResponseEntity } from '@common/models/response.entity';
import { Public } from '@common/decorators/public.decorator';
import { ActivityDetailsResponseDTO } from './dto/activity-details.res.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get()
  async getActivityDetails(): Promise<
    ResponseEntity<ActivityDetailsResponseDTO[]>
  > {
    const activityDetails = await this.activityService.getAll();
    return ResponseEntity.OK_WITH_DATA(
      '활동 목록 조회에 성공하였습니다.',
      ActivityDetailsResponseDTO.from(activityDetails),
    );
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ResponseEntity } from '@common/models/response.entity';
import { ParticipationService } from '../application/participation.service';
import { ParticipationApplicationRequestDto } from './dto/participation-application-request.dto';
import { User } from '@common/decorators/user.decorator';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post()
  async applyParticipation(
    @Body() dto: ParticipationApplicationRequestDto,
    @User('userId') userId: number,
  ): Promise<ResponseEntity<void>> {
    await this.participationService.applyParticipation(dto.activityId, userId);
    return ResponseEntity.OK_WITH('참가 신청에 성공했습니다.');
  }
}

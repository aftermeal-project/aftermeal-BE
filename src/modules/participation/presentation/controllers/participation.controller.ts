import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ParticipationService } from '../../application/services/participation.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ResponseEntity } from '@common/models/response.entity';

@Controller()
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post('participations')
  async participate(
    @Body('activityId') activityId: number,
    @CurrentUser('sub') userId: number,
  ) {
    await this.participationService.participate(activityId, userId);
    return ResponseEntity.OK('참가 신청이 완료되었습니다.');
  }

  @Delete('participations/:participationId')
  async cancelParticipation(
    @Param('participationId') participationId: number,
    @CurrentUser('sub') userId: number,
  ) {
    await this.participationService.cancelParticipation(participationId, userId);
    return ResponseEntity.OK('참가 신청이 취소되었습니다.');
  }
}

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ParticipationService } from '../../application/services/participation.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ResponseEntity } from '@common/models/response.entity';
import { User } from '../../../user/domain/entities/user.entity';

@Controller()
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post('participations')
  async participate(
    @Body('activityId') activityId: number,
    @CurrentUser('sub') userId: number,
  ) {
    await this.participationService.participate(activityId, userId);
    return ResponseEntity.OK('참가가 완료되었습니다.');
  }

  @HttpCode(204)
  @Delete('participations/:participationId')
  async cancelParticipation(
    @Param('participationId') participationId: number,
    @CurrentUser() user: User,
  ) {
    await this.participationService.deleteParticipation(participationId, user);
    return ResponseEntity.OK('참가 신청이 취소되었습니다.');
  }
}

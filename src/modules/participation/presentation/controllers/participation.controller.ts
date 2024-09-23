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
  ): Promise<ResponseEntity<null>> {
    await this.participationService.participate(activityId, userId);
    return ResponseEntity.SUCCESS();
  }

  @Delete('participations/:participationId')
  @HttpCode(204)
  async cancelParticipation(
    @Param('participationId') participationId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.participationService.deleteParticipation(participationId, user);
  }
}

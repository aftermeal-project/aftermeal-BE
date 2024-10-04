import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParticipationService } from '../../application/services/participation.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ResponseEntity } from '@common/models/response.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { ParticipationOwnerGuard } from '../../infrastructure/guards/participation-owner.guard';

@Controller()
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post('participations')
  async participate(
    @Body('activityId') activityId: number,
    @CurrentUser() user: User,
  ): Promise<ResponseEntity<null>> {
    await this.participationService.participate(activityId, user);
    return ResponseEntity.CREATED();
  }

  @UseGuards(ParticipationOwnerGuard)
  @Delete('participations/:participationId')
  @HttpCode(204)
  async deleteParticipation(
    @Param('participationId') participationId: number,
  ): Promise<void> {
    await this.participationService.deleteParticipation(participationId);
  }
}

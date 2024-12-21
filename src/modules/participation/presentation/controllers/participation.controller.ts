import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParticipationService } from '../../application/services/participation.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ResponseEntity } from '@common/models/response.entity';
import { ParticipationOwnerGuard } from '../../infrastructure/guards/participation-owner.guard';
import { TIME } from '@common/constants/dependency-token';
import { TimeService } from '@common/time/time.service';
import { AccessTokenPayload } from '../../../auth/domain/types/jwt-payload';

@Controller()
export class ParticipationController {
  constructor(
    private readonly participationService: ParticipationService,
    @Inject(TIME)
    private readonly time: TimeService,
  ) {}

  @Post('participations')
  async participate(
    @Body('activityId') activityId: number,
    @CurrentUser() tokenPayload: AccessTokenPayload,
  ): Promise<ResponseEntity<null>> {
    await this.participationService.participate(
      activityId,
      tokenPayload.sub,
      this.time.now(),
    );
    return ResponseEntity.SUCCESS();
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
